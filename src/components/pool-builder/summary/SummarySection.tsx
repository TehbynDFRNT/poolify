import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { PoolConcreteSelection, PoolFenceConcreteStrip, PoolPavingSelection } from '@/integrations/supabase/types';
import { Pool } from '@/types/pool';
import { formatCurrency } from '@/utils/format';
import { ExtendedPoolEquipmentSelection, fetchPoolProjectWithRelations, getFirstOrEmpty } from '@/utils/poolProjectHelpers';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import React, { createContext, Suspense, useState } from 'react';
import { ConcreteAndPavingSummary } from './ConcreteAndPavingSummary';
import { PoolDetails } from './PoolDetails';
import { RetainingWallsSummary } from './RetainingWallsSummary';
import { SiteRequirementsSummary } from './SiteRequirementsSummary';
import { TotalCostSummary } from './TotalCostSummary';

export const MarginVisibilityContext = createContext<boolean>(false);

interface SummarySectionProps {
    showMargins?: boolean;
}

// Utility function to validate UUID format
const validateUuid = (id: string): boolean => {
    return !!id && typeof id === 'string' && !!id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
};

const CostRow = ({ name, cost, margin, marginPct, total }) => (
    <tr>
        <td className="font-medium">{name}</td>
        <td className="text-right">{formatCurrency(cost)}</td>
        <td className="text-right">{formatCurrency(margin)}</td>
        <td className="text-right">{marginPct ? `${marginPct}%` : ''}</td>
        <td className="text-right">{formatCurrency(total)}</td>
    </tr>
);

export const SummarySection: React.FC<SummarySectionProps> = ({
    showMargins = false,
}) => {
    // Get the customer ID from URL query parameters instead of the path
    const customerId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('customerId') || ''
        : '';

    // Validate UUID format
    const isValidUuid = validateUuid(customerId);

    // Set up a toggle for showing/hiding filtration package details
    const [showFilterDetails, setShowFilterDetails] = useState(false);

    // Get project data from the pool_projects table
    const { data: projectData, isLoading, error: projectError } = useQuery({
        queryKey: ['project-summary', customerId],
        queryFn: async () => {
            if (!customerId) {
                console.error("No customer ID provided");
                return null;
            }

            if (!validateUuid(customerId)) {
                console.error("Invalid UUID format for customerId:", customerId);
                return null;
            }

            console.log(`Fetching project data for customerId: ${customerId}`);

            try {
                const { data, error } = await fetchPoolProjectWithRelations(customerId);

                if (error) {
                    console.error("Error fetching project data:", error);
                    return null;
                }

                console.log("Successfully fetched project data:", {
                    hasPoolSpec: !!data?.pool_specification_id,
                    retainingWalls: data?.pool_retaining_walls?.length || 0,
                    concreteSelections: data?.pool_concrete_selections?.length || 0,
                    pavingSelections: data?.pool_paving_selections?.length || 0,
                    fenceStrips: data?.pool_fence_concrete_strips?.length || 0,
                    equipmentSelections: data?.pool_equipment_selections?.length || 0,
                    heatingOptions: data?.pool_heating_options?.length || 0
                });

                return data;
            } catch (error) {
                console.error("Error fetching project data:", error);
                return null;
            }
        },
        enabled: !!customerId && validateUuid(customerId),
    });

    // Get pool specification data if a specification is selected
    const { data: pool } = useQuery({
        queryKey: ['pool-specification', projectData?.pool_specification_id],
        queryFn: async () => {
            if (!projectData?.pool_specification_id) return null;

            console.log(`Fetching pool specification for id: ${projectData.pool_specification_id}`);

            try {
                const { data, error } = await supabase
                    .from('pool_specifications')
                    .select('*')
                    .eq('id', projectData.pool_specification_id)
                    .single();

                if (error) {
                    console.error("Error fetching pool specification:", error);
                    return null;
                }

                console.log("Successfully fetched pool specification:", data?.name || "Unknown");

                return data as Pool;
            } catch (error) {
                console.error("Error fetching pool specification:", error);
                return null;
            }
        },
        enabled: !!projectData?.pool_specification_id,
    });

    // Fetch water features data
    const { data: waterFeatures } = useQuery({
        queryKey: ['water-features', customerId],
        queryFn: async () => {
            if (!customerId || !validateUuid(customerId)) return null;

            console.log(`Fetching water features for customerId: ${customerId}`);

            try {
                // Changed to get all rows and then just take the most recent one
                const { data, error } = await supabase
                    .from('pool_water_features')
                    .select('*')
                    .eq('customer_id', customerId)
                    .order('updated_at', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error("Error fetching water features:", error);
                    return null;
                }

                // Get the most recent entry if any exist
                const mostRecent = data && data.length > 0 ? data[0] : null;
                console.log(`Water features data: ${data?.length || 0} records found, using most recent`);

                return mostRecent;
            } catch (error) {
                console.error("Error fetching water features:", error);
                return null;
            }
        },
        enabled: !!customerId && validateUuid(customerId),
    });

    // Fetch electrical requirements data
    const { data: electrical } = useQuery({
        queryKey: ['electrical-requirements', customerId],
        queryFn: async () => {
            if (!customerId || !validateUuid(customerId)) return null;

            console.log(`Fetching electrical requirements for customerId: ${customerId}`);

            try {
                // Changed to get all rows and then just take the most recent one
                const { data, error } = await supabase
                    .from('pool_electrical_requirements')
                    .select('*')
                    .eq('customer_id', customerId)
                    .order('updated_at', { ascending: false })
                    .limit(1);

                if (error) {
                    console.error("Error fetching electrical requirements:", error);
                    return null;
                }

                // Get the most recent entry if any exist
                const mostRecent = data && data.length > 0 ? data[0] : null;
                console.log(`Electrical requirements data: ${data?.length || 0} records found, using most recent`);

                return mostRecent;
            } catch (error) {
                console.error("Error fetching electrical requirements:", error);
                return null;
            }
        },
        enabled: !!customerId && validateUuid(customerId),
    });

    // Fetch frameless glass fencing data
    const { data: glassFencing } = useQuery({
        queryKey: ['glass-fencing', customerId],
        queryFn: async () => {
            if (!customerId || !validateUuid(customerId)) return null;

            console.log(`Fetching glass fencing for customerId: ${customerId}`);

            try {
                // Change .single() to .maybeSingle() to handle empty results better
                const { data, error } = await supabase
                    .from('frameless_glass_fencing')
                    .select('*')
                    .eq('customer_id', customerId)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching glass fencing data:", error);
                    return null;
                }

                console.log("Glass fencing data:", data ? "Found" : "Not found");
                return data;
            } catch (error) {
                console.error("Error fetching glass fencing data:", error);
                return null;
            }
        },
        enabled: !!customerId && validateUuid(customerId),
    });

    // Fetch flat top metal fencing data
    const { data: metalFencing } = useQuery({
        queryKey: ['metal-fencing', customerId],
        queryFn: async () => {
            if (!customerId || !validateUuid(customerId)) return null;

            console.log(`Fetching metal fencing for customerId: ${customerId}`);

            try {
                // Change .single() to .maybeSingle() to handle empty results better
                const { data, error } = await supabase
                    .from('flat_top_metal_fencing')
                    .select('*')
                    .eq('customer_id', customerId)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching metal fencing data:", error);
                    return null;
                }

                console.log("Metal fencing data:", data ? "Found" : "Not found");
                return data;
            } catch (error) {
                console.error("Error fetching metal fencing data:", error);
                return null;
            }
        },
        enabled: !!customerId && validateUuid(customerId),
    });

    // Fetch pool cleaner data
    const { data: poolCleaner } = useQuery({
        queryKey: ['pool-cleaner', customerId, projectData?.pool_specification_id],
        queryFn: async () => {
            if (!customerId || !validateUuid(customerId) || !projectData?.pool_specification_id) return null;

            console.log(`Fetching pool cleaner for customerId: ${customerId}, poolSpecId: ${projectData.pool_specification_id}`);

            try {
                // Change .single() to .maybeSingle() to handle empty results better
                const { data, error } = await supabase
                    .from('pool_cleaner_selections')
                    .select('*, pool_cleaner:pool_cleaner_id(*)')
                    .eq('pool_id', projectData.pool_specification_id)
                    .eq('customer_id', customerId)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching pool cleaner:", error);
                    return null;
                }

                console.log("Pool cleaner data:", data ? "Found" : "Not found");
                return data;
            } catch (error) {
                console.error("Error fetching pool cleaner:", error);
                return null;
            }
        },
        enabled: !!(customerId && validateUuid(customerId) && projectData?.pool_specification_id),
    });

    // Show loading state while fetching data
    if (isLoading && isValidUuid) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading project details...</p>
                </div>
            </div>
        );
    }

    // Show error if invalid UUID
    if (!isValidUuid && customerId) {
        return (
            <div className="p-4 text-center space-y-4">
                <h2 className="text-xl font-semibold text-muted-foreground">
                    Invalid Project ID
                </h2>
                <p className="text-muted-foreground">
                    The project ID "{customerId}" is not in a valid format.
                </p>
            </div>
        );
    }

    // Show error if there was an issue fetching the project data
    if (projectError) {
        return (
            <div className="p-4 text-center space-y-4">
                <h2 className="text-xl font-semibold text-muted-foreground">
                    Error Loading Project
                </h2>
                <p className="text-muted-foreground">
                    There was an error loading the project data. Please try again later.
                </p>
            </div>
        );
    }

    // Show no data state if no project data or no pool selection
    if (!projectData || !pool) {
        return (
            <div className="p-4 text-center space-y-4">
                <h2 className="text-xl font-semibold text-muted-foreground">
                    {!projectData ? "Project data not found" : "No pool selected yet"}
                </h2>
                <p className="text-muted-foreground">
                    {!projectData
                        ? "Please create a new project or select an existing one."
                        : "Please select a pool specification before viewing the summary."}
                </p>
            </div>
        );
    }

    // Extract data from junction tables
    const retainingWalls = projectData.pool_retaining_walls || [];
    const concreteSelections = getFirstOrEmpty(projectData.pool_concrete_selections) as PoolConcreteSelection;
    const pavingSelections = getFirstOrEmpty(projectData.pool_paving_selections) as PoolPavingSelection;
    const fenceConcreteStrips = getFirstOrEmpty(projectData.pool_fence_concrete_strips) as PoolFenceConcreteStrip;
    const equipmentSelections = getFirstOrEmpty(projectData.pool_equipment_selections) as ExtendedPoolEquipmentSelection;
    const heatingOptions = getFirstOrEmpty(projectData.pool_heating_options) as any;

    // Calculate concrete and paving costs
    const concretePavingTotal =
        // Concrete selections
        (concreteSelections?.concrete_pump_total_cost || 0) +
        (concreteSelections?.concrete_cuts_cost || 0) +
        // Paving selections
        (pavingSelections?.extra_paving_total_cost || 0) +
        (pavingSelections?.existing_concrete_paving_total_cost || 0) +
        (pavingSelections?.extra_concreting_total_cost || 0) +
        // Fence concrete strips
        (fenceConcreteStrips?.total_cost || 0);

    // Calculate retaining walls total cost
    const retainingWallsTotal = retainingWalls.reduce(
        (sum, wall) => sum + (wall.total_cost || 0),
        0
    );

    // Calculate fencing total
    const fencingTotal =
        (glassFencing?.total_cost || 0) +
        (metalFencing?.total_cost || 0);

    // Prepare summary data
    const summaryData = {
        pool_id: pool.id,
        pool_specs_id: pool.id,
        project_id: customerId,
        filtration_cost: pool.default_filtration_package_id ? 0 : 0, // Replace with actual filtration package cost when available
        excavation_cost: 0, // Replace with actual excavation cost when available
        fixed_costs: 0, // Replace with actual fixed costs when available
        site_requirements_total: (() => {
            try {
                // Calculate site requirements costs

                // Get custom requirements costs
                const customRequirementsCost = Array.isArray(projectData.site_requirements_data)
                    ? projectData.site_requirements_data.reduce((sum: number, item: any) => sum + (item.price || 0), 0)
                    : typeof projectData.site_requirements_data === 'object' && projectData.site_requirements_data
                        ? (projectData.site_requirements_data.price || 0)
                        : 0;

                // Get equipment costs from the equipment selections junction table
                const craneCost = equipmentSelections?.crane?.price || 0;
                const trafficControlCost = equipmentSelections?.traffic_control?.price || 0;
                const bobcatCost = equipmentSelections?.bobcat?.price || 0;

                // Calculate total
                const calculatedTotal = craneCost + trafficControlCost + bobcatCost + customRequirementsCost;
                const total = calculatedTotal > 0 ? calculatedTotal : 0;

                if (process.env.NODE_ENV !== 'production') {
                    console.log("SummarySection - Calculated Site Requirements Total:", total);
                }

                return total;
            } catch (error) {
                console.error("Error calculating site requirements total:", error);
                return 0;
            }
        })(),
        concrete_paving_total: concretePavingTotal,
        retaining_walls_total: retainingWallsTotal,
        water_features_total: waterFeatures?.total_cost || 0,
        fencing_total: fencingTotal,
        electrical_total: electrical?.total_cost || 0,
        upgrades_extras_total: 0, // This would be calculated elsewhere
        heating_total_cost: heatingOptions?.total_cost || 0,
        heating_total_margin: heatingOptions?.total_margin || 0,
    };

    // Grand total calculations
    const costPrice =
        (summaryData.filtration_cost || 0) +
        (summaryData.excavation_cost || 0) +
        (summaryData.fixed_costs || 0) +
        (summaryData.site_requirements_total || 0) +
        (summaryData.concrete_paving_total || 0) +
        (summaryData.retaining_walls_total || 0) +
        (summaryData.water_features_total || 0) +
        (summaryData.fencing_total || 0) +
        (summaryData.electrical_total || 0) +
        (summaryData.upgrades_extras_total || 0);
    const margin = summaryData.heating_total_margin || 0;
    const marginPct = pool.pool_margin_pct || 0;
    const totalPrice = costPrice + margin;

    // Helper for margin calculation per section
    const calcMargin = (cost, marginPct) => cost && marginPct ? cost * (marginPct / 100) : 0;
    const calcTotal = (cost, marginPct) => cost + calcMargin(cost, marginPct);

    // Section breakdowns
    const sections = [
        {
            name: 'Pool Shell',
            cost: summaryData.filtration_cost || 0,
            margin: calcMargin(summaryData.filtration_cost || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.filtration_cost || 0, marginPct),
        },
        {
            name: 'Fixed Costs',
            cost: summaryData.fixed_costs || 0,
            margin: 0,
            marginPct: 0,
            total: summaryData.fixed_costs || 0,
        },
        {
            name: 'Site Requirements',
            cost: summaryData.site_requirements_total || 0,
            margin: calcMargin(summaryData.site_requirements_total || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.site_requirements_total || 0, marginPct),
        },
        {
            name: 'Concrete & Paving',
            cost: summaryData.concrete_paving_total || 0,
            margin: calcMargin(summaryData.concrete_paving_total || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.concrete_paving_total || 0, marginPct),
        },
        {
            name: 'Retaining Walls',
            cost: summaryData.retaining_walls_total || 0,
            margin: calcMargin(summaryData.retaining_walls_total || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.retaining_walls_total || 0, marginPct),
        },
        {
            name: 'Water Feature',
            cost: summaryData.water_features_total || 0,
            margin: calcMargin(summaryData.water_features_total || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.water_features_total || 0, marginPct),
        },
        {
            name: 'Fencing',
            cost: summaryData.fencing_total || 0,
            margin: calcMargin(summaryData.fencing_total || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.fencing_total || 0, marginPct),
        },
        {
            name: 'Heating',
            cost: summaryData.heating_total_cost || 0,
            margin: calcMargin(summaryData.heating_total_cost || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.heating_total_cost || 0, marginPct),
        },
        {
            name: 'Electrical',
            cost: summaryData.electrical_total || 0,
            margin: calcMargin(summaryData.electrical_total || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.electrical_total || 0, marginPct),
        },
        {
            name: 'Extras & Add-ons',
            cost: summaryData.upgrades_extras_total || 0,
            margin: calcMargin(summaryData.upgrades_extras_total || 0, marginPct),
            marginPct,
            total: calcTotal(summaryData.upgrades_extras_total || 0, marginPct),
        },
    ];

    // Return the summary section layout
    return (
        <MarginVisibilityContext.Provider value={showMargins}>
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="grid grid-cols-1 gap-8">
                    {/* Pool Details Card - Top section */}
                    <Card className="shadow-md">
                        <CardHeader className="bg-white border-b border-slate-200">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-primary text-xl">Pool Project Summary</CardTitle>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowFilterDetails(!showFilterDetails)}
                                    >
                                        {showFilterDetails ? "Hide Filtration Details" : "Show Filtration Details"}
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="py-4">
                            {/* Pool Details */}
                            <div className="mb-8">
                                <Suspense fallback={<div>Loading pool details...</div>}>
                                    <PoolDetails
                                        pool={pool}
                                        customerId={customerId}
                                        projectData={projectData}
                                    />
                                </Suspense>
                            </div>

                            {/* Show filtration package details if toggled on */}
                            {showFilterDetails && (
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">Filtration Package</h3>
                                    <p className="text-muted-foreground">
                                        Filtration package details will be displayed here. This feature is currently being implemented.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Total Cost Summary */}
                    <Card className="shadow-md">
                        <CardContent className="py-4">
                            <Suspense fallback={<div>Loading cost summary...</div>}>
                                <TotalCostSummary
                                    pool={pool}
                                    customerId={customerId}
                                    projectData={{ ...projectData, ...summaryData }}
                                />
                            </Suspense>
                        </CardContent>
                    </Card>

                    {/* Additional sections - These would be rendered conditionally based on data availability */}
                    <Suspense fallback={<div>Loading retaining walls summary...</div>}>
                        <RetainingWallsSummary
                            pool={pool}
                            customerId={customerId}
                            retainingWalls={{ walls: retainingWalls }}
                        />
                    </Suspense>

                    <Suspense fallback={<div>Loading concrete & paving summary...</div>}>
                        <ConcreteAndPavingSummary
                            pool={pool}
                            customerId={customerId}
                            concretePaving={{
                                concrete_pump_needed: concreteSelections?.concrete_pump_needed,
                                concrete_pump_quantity: concreteSelections?.concrete_pump_quantity,
                                concrete_pump_total_cost: concreteSelections?.concrete_pump_total_cost,
                                concrete_cuts: concreteSelections?.concrete_cuts,
                                concrete_cuts_cost: concreteSelections?.concrete_cuts_cost,
                                extra_paving_category: pavingSelections?.extra_paving_category,
                                extra_paving_square_meters: pavingSelections?.extra_paving_square_meters,
                                extra_paving_total_cost: pavingSelections?.extra_paving_total_cost,
                                existing_concrete_paving_category: pavingSelections?.existing_concrete_paving_category,
                                existing_concrete_paving_square_meters: pavingSelections?.existing_concrete_paving_square_meters,
                                existing_concrete_paving_total_cost: pavingSelections?.existing_concrete_paving_total_cost,
                                extra_concreting_type: pavingSelections?.extra_concreting_type,
                                extra_concreting_square_meters: pavingSelections?.extra_concreting_square_meters,
                                extra_concreting_total_cost: pavingSelections?.extra_concreting_total_cost,
                                under_fence_concrete_strips_data: fenceConcreteStrips?.strip_data,
                                under_fence_concrete_strips_cost: fenceConcreteStrips?.total_cost
                            }}
                        />
                    </Suspense>

                    <Suspense fallback={<div>Loading site requirements summary...</div>}>
                        <SiteRequirementsSummary
                            pool={pool}
                            customerId={customerId}
                            siteRequirements={{
                                requirementsData: projectData.site_requirements_data,
                                requirementsNotes: projectData.site_requirements_notes,
                                equipmentSelections: equipmentSelections
                            }}
                        />
                    </Suspense>

                    {/* Grand Total Section */}
                    <Card className="shadow-md">
                        <CardContent className="py-4">
                            <h2 className="text-2xl font-bold mb-2">Grand Total</h2>
                            <table className="min-w-full border rounded-md bg-white">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="text-left p-2">Cost Price</th>
                                        <th className="text-left p-2">Margin</th>
                                        <th className="text-left p-2">Margin %</th>
                                        <th className="text-left p-2">Total Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="p-2">{formatCurrency(costPrice)}</td>
                                        <td className="p-2">{formatCurrency(margin)}</td>
                                        <td className="p-2">{marginPct}%</td>
                                        <td className="p-2 font-bold text-primary">{formatCurrency(totalPrice)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>

                    {/* Section Breakdown */}
                    <Card className="shadow-md">
                        <CardContent className="py-4">
                            <h3 className="text-xl font-semibold mb-2">Section Breakdown</h3>
                            <table className="min-w-full border rounded-md bg-white">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="text-left p-2">Section</th>
                                        <th className="text-right p-2">Cost Price</th>
                                        <th className="text-right p-2">Margin</th>
                                        <th className="text-right p-2">Margin %</th>
                                        <th className="text-right p-2">Total (With Margin)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sections.map((section, idx) => (
                                        <CostRow key={idx} {...section} />
                                    ))}
                                </tbody>
                            </table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MarginVisibilityContext.Provider>
    );
}; 