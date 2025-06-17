import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { usePriceCalculator } from '@/hooks/calculations/use-calculator-totals';
import { usePoolDiscounts } from '@/hooks/usePoolDiscounts';
import { supabase } from '@/integrations/supabase/client';
import { PoolGeneralExtra } from "@/types/pool-general-extra";
import type { ProposalSnapshot } from '@/types/snapshot';
import type { DiscountPromotion } from '@/types/discount-promotion';
import {
    calculateConcreteCutsMargin,
    calculateConcretePumpMargin,
    calculateExtraConcretingMargin,
    calculateExtraPavingMargin,
    calculateUnderFenceStripsMargin
} from '@/utils/concrete-margin-calculations';
import { fetchConcreteAndPavingData } from '@/utils/concrete-paving-data';
import { fetchPoolGeneralExtras } from "@/utils/fetch-pool-general-extras";
import { formatCurrency } from '@/utils/format';
import { validateUuid } from '@/utils/validators';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, FileText, Loader2, User, Percent, X } from 'lucide-react';
import React, { createContext, useState } from 'react';
import { ProjectSubmitButton } from './ProjectSubmitButton';

export const MarginVisibilityContext = createContext<boolean>(false);

interface SummarySectionProps {
    showMargins?: boolean;
    hideSubmitButton?: boolean;
}

// Line item component for detailed cost breakdowns
const LineItem = ({ label, code, value, breakdown = null }) => (
    <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-left">
            {label} {code && code.indexOf('_') === -1 && <span className="text-muted-foreground text-sm">({code})</span>}
        </td>
        <td className="py-3 px-4 text-right">{formatCurrency(value)}</td>
        {breakdown && <td className="py-3 px-4 text-left text-muted-foreground text-sm">{breakdown}</td>}
        {!breakdown && <td></td>}
    </tr>
);

// Subtotal row for sections
const SubtotalRow = ({ label, value }) => (
    <tr className="border-b border-gray-200 font-medium">
        <td className="py-3 px-4 text-left">{label}</td>
        <td className="py-3 px-4 text-right">{formatCurrency(value)}</td>
        <td></td>
    </tr>
);

// Margin row showing percentage and calculation
const MarginRow = ({ percentage, formula = "Formula: Cost ÷ (1 - margin %)" }) => (
    <tr className="border-b border-gray-100">
        <td className="py-3 px-4 text-left">Margin Applied</td>
        <td className="py-3 px-4 text-right">{percentage}%</td>
        <td className="py-3 px-4 text-left text-muted-foreground text-sm">{formula}</td>
    </tr>
);

// Total row with background highlight
const TotalRow = ({ label, value }) => (
    <tr className="bg-gray-50 font-bold">
        <td className="py-3 px-4 text-left">{label}</td>
        <td className="py-3 px-4 text-right text-gray-900 font-semibold">{formatCurrency(value)}</td>
        <td></td>
    </tr>
);

// Section card component for each section (Pool, Installation, etc)
const SectionCard = ({ title, children, marginIncluded = false }) => (
    <Card className="mb-6 shadow-none">
        <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                    {title} {marginIncluded && "(Margin Included)"}
                </h3>
            </div>
            <div className="space-y-4">
                <table className="w-full">
                    <tbody>
                        {children}
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
);

// Handover Kit Items display component
const HandoverKitItems = ({ components }) => {
    if (!components || components.length === 0) return null;

    return (
        <div className="text-sm text-muted-foreground">
            {components.map((item, idx) => (
                <span key={idx}>
                    {item.hk_component_name} ({item.hk_component_price_inc_gst} × {item.hk_component_quantity}){idx < components.length - 1 ? ', ' : ''}
                </span>
            ))}
        </div>
    );
};

// Main section component
export const SummarySection: React.FC<SummarySectionProps> = ({
    showMargins = false,
    hideSubmitButton = false,
}) => {
    // Add state for view mode - default to Customer View
    const [isCustomerView, setIsCustomerView] = useState(true);
    // Add state for expanded sections
    const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
        basePrice: false,
        siteRequirements: false,
        concretePaving: false,
        retainingWalls: false,
        fencing: false,
        electrical: false,
        waterFeatures: false,
        upgradesExtrasGeneral: false,
        upgradesExtrasHeating: false,
        upgradesExtrasCleaner: false,
        discounts: false
    });

    // Add state for discount selection
    const [selectedDiscountId, setSelectedDiscountId] = useState<string>('');

    // Toggle expansion for a section
    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // Get the customer ID from URL query parameters
    const customerId = typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('customerId') || ''
        : '';

    // Validate UUID format
    const isValidUuid = validateUuid(customerId);

    // Initialize pool discounts hook
    const {
        poolDiscounts,
        availablePromotions,
        isLoadingPoolDiscounts,
        isLoadingPromotions,
        addDiscount,
        removeDiscount,
        isAddingDiscount,
        isRemovingDiscount,
        isDiscountApplied,
        getAppliedDiscountsWithDetails,
    } = usePoolDiscounts(customerId);

    // Fetch project snapshot data
    const { data: snapshot, isLoading, error } = useQuery<ProposalSnapshot | null>({
        queryKey: ['project-snapshot', customerId],
        queryFn: async () => {
            if (!customerId || !isValidUuid) return null;

            console.log(`Fetching project snapshot for customerId: ${customerId}`);

            try {
                const { data, error } = await supabase
                    .from('proposal_snapshot_v')
                    .select('*')
                    .eq('project_id', customerId)
                    .single();

                if (error) {
                    console.error("Error fetching project snapshot:", error);
                    return null;
                }

                console.log("Successfully fetched project snapshot");
                return data as unknown as ProposalSnapshot;
            } catch (error) {
                console.error("Error in project snapshot query:", error);
                return null;
            }
        },
        enabled: !!customerId && isValidUuid,
    });

    // Pool specification data is already in the snapshot, no need to fetch separately

    // Fetch equipment names from database using direct selection queries
    const { data: equipmentData } = useQuery({
        queryKey: ['equipment-data', customerId],
        queryFn: async () => {
            if (!customerId) return null;

            try {
                // Get the equipment selection from pool_equipment_selections table
                const { data, error } = await supabase
                    .from("pool_equipment_selections")
                    .select(`
                        crane:crane_id(id, name, price),
                        bobcat:bobcat_id(id, day_code, size_category, price),
                        traffic_control:traffic_control_id(id, name, price)
                    `)
                    .eq('pool_project_id', customerId)
                    .maybeSingle();

                if (error) {
                    console.error("Error fetching equipment selections:", error);
                    return null;
                }

                console.log("Equipment data from database:", data);

                return {
                    crane: data?.crane || null,
                    bobcat: data?.bobcat || null,
                    trafficControl: data?.traffic_control || null
                };
            } catch (error) {
                console.error("Error in equipment selections fetch:", error);
                return null;
            }
        },
        enabled: !!customerId
    });

    // Fetch concrete and paving category details
    const { data: pavingData } = useQuery({
        queryKey: ['paving-data', customerId],
        queryFn: async () => {
            if (!customerId) return null;

            try {
                // Get the paving selections for this customer
                const { data, error } = await supabase
                    .from("pool_paving_selections")
                    .select(`
                        id, 
                        extra_paving_category,
                        existing_concrete_paving_category,
                        extra_concreting_type
                    `)
                    .eq('pool_project_id', customerId)
                    .maybeSingle();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching paving selections:", error);
                    return null;
                }

                // If we have categories, fetch their names
                let extraPavingCategoryName = null;
                let existingPavingCategoryName = null;
                let extraConcretingType = data?.extra_concreting_type || null;

                if (data?.extra_paving_category) {
                    const { data: extraPavingData } = await supabase
                        .from('extra_paving_costs')
                        .select('category')
                        .eq('id', data.extra_paving_category)
                        .single();

                    if (extraPavingData) {
                        extraPavingCategoryName = extraPavingData.category;
                    }
                }

                if (data?.existing_concrete_paving_category) {
                    const { data: existingPavingData } = await supabase
                        .from('extra_paving_costs')
                        .select('category')
                        .eq('id', data.existing_concrete_paving_category)
                        .single();

                    if (existingPavingData) {
                        existingPavingCategoryName = existingPavingData.category;
                    }
                }

                // We'll just use the raw type value without the lookup
                // since we're having issues with the extra_concreting_types table

                return {
                    extraPavingCategory: extraPavingCategoryName,
                    existingPavingCategory: existingPavingCategoryName,
                    extraConcretingType: extraConcretingType
                };
            } catch (error) {
                console.error("Error in paving data fetch:", error);
                return null;
            }
        },
        enabled: !!customerId
    });

    const craneData = equipmentData?.crane;
    const bobcatData = equipmentData?.bobcat;
    const trafficControlData = equipmentData?.trafficControl;

    console.log("Equipment selections from database:", {
        crane: craneData,
        bobcat: bobcatData,
        trafficControl: trafficControlData
    });

    console.log("Paving category data:", pavingData);

    // Fetch concrete cuts details
    const { data: concreteCutsData } = useQuery({
        queryKey: ['concrete-cuts-data', customerId, snapshot?.concrete_cuts_json],
        queryFn: async () => {
            if (!customerId || !snapshot?.concrete_cuts_json) return [];

            try {
                // Parse the concrete_cuts_json if it's a string
                let parsedCuts: any[] = [];

                if (typeof snapshot.concrete_cuts_json === 'string') {
                    try {
                        parsedCuts = JSON.parse(snapshot.concrete_cuts_json);
                    } catch (e) {
                        console.error("Error parsing concrete_cuts_json:", e);
                        return [];
                    }
                } else if (Array.isArray(snapshot.concrete_cuts_json)) {
                    parsedCuts = snapshot.concrete_cuts_json;
                } else {
                    console.error("concrete_cuts_json is neither a string nor an array");
                    return [];
                }

                if (parsedCuts.length === 0) return [];

                // Extract the cut IDs - make sure we're getting strings, not objects
                const cutIds = parsedCuts.map(cut => {
                    if (typeof cut === 'string') return cut;
                    if (typeof cut === 'object' && cut !== null) return cut.id || '';
                    return '';
                }).filter(id => id !== ''); // Filter out empty strings

                if (cutIds.length === 0) return [];

                console.log("Concrete cut IDs:", cutIds);

                const { data, error } = await supabase
                    .from('concrete_cuts')
                    .select('id, cut_type, price')
                    .in('id', cutIds);

                if (error) {
                    console.error("Error fetching concrete cuts details:", error);
                    return [];
                }

                return data;
            } catch (error) {
                console.error("Error in concrete cuts fetch:", error);
                return [];
            }
        },
        enabled: !!customerId && !!snapshot?.concrete_cuts_json
    });

    console.log("Concrete cuts data:", concreteCutsData);

    // Fetch concrete pump details
    const { data: concretePumpData } = useQuery({
        queryKey: ['concrete-pump-data', customerId],
        queryFn: async () => {
            if (!customerId) return null;

            try {
                // Get the concrete pump details for this project
                const { data, error } = await supabase
                    .from("pool_concrete_selections")
                    .select(`
                        concrete_pump_needed,
                        concrete_pump_quantity
                    `)
                    .eq('pool_project_id', customerId)
                    .maybeSingle();

                if (error && error.code !== 'PGRST116') {
                    console.error("Error fetching concrete pump details:", error);
                    return null;
                }

                return data;
            } catch (error) {
                console.error("Error in concrete pump fetch:", error);
                return null;
            }
        },
        enabled: !!customerId
    });

    console.log("Concrete pump data:", concretePumpData);

    // Use the price calculator hook to get consistent calculations (must be called before any early returns)
    const appliedDiscounts = getAppliedDiscountsWithDetails();
    const priceCalculatorResult = usePriceCalculator(snapshot, appliedDiscounts);

    // Fetch concrete and paving margin data
    const { data: concretePavingMarginData } = useQuery({
        queryKey: ['concrete-paving-margin', customerId],
        queryFn: async () => {
            if (!customerId) return { totalMargin: 0 };

            try {
                // Fetch the concrete and paving data
                const data = await fetchConcreteAndPavingData(customerId);
                if (!data) return { totalMargin: 0 };

                // Calculate all margins using the same methods as the concrete & paving tab
                const extraPavingMargin = await calculateExtraPavingMargin(
                    data.extra_paving_category,
                    data.extra_paving_square_meters || 0
                );

                const existingConcretePavingMargin = await calculateExtraPavingMargin(
                    data.existing_concrete_paving_category,
                    data.existing_concrete_paving_square_meters || 0
                );

                let extraConcretingMargin = 0;
                if (data.extra_concreting_type && data.extra_concreting_square_meters) {
                    extraConcretingMargin = await calculateExtraConcretingMargin(
                        data.extra_concreting_type,
                        data.extra_concreting_square_meters
                    );
                }

                const concretePumpMargin = calculateConcretePumpMargin(data.concrete_pump_total_cost || 0);

                const underFenceStripsMargin = await calculateUnderFenceStripsMargin(
                    data.under_fence_concrete_strips_data
                );

                const concreteCutsMargin = calculateConcreteCutsMargin(data.concrete_cuts_cost || 0);

                // Calculate total margin
                const totalMargin =
                    extraPavingMargin +
                    existingConcretePavingMargin +
                    extraConcretingMargin +
                    concretePumpMargin +
                    underFenceStripsMargin +
                    concreteCutsMargin;

                return {
                    totalMargin,
                    breakdownData: {
                        extraPavingMargin,
                        existingConcretePavingMargin,
                        extraConcretingMargin,
                        concretePumpMargin,
                        underFenceStripsMargin,
                        concreteCutsMargin
                    }
                };
            } catch (error) {
                console.error("Error calculating concrete & paving margins:", error);
                return { totalMargin: 0 };
            }
        },
        enabled: !!customerId
    });

    // Fetch retaining walls margin data
    const { data: retainingWallsMarginData } = useQuery({
        queryKey: ['retaining-walls-margin', customerId],
        queryFn: async () => {
            if (!customerId) return { totalMargin: 0 };

            try {
                // Get all wall types from retaining_walls table to use for margin calculation
                const { data: wallTypes, error: wallTypesError } = await supabase
                    .from('retaining_walls')
                    .select('type, margin');

                if (wallTypesError) {
                    console.error("Error fetching retaining wall types:", wallTypesError);
                    return { totalMargin: 0 };
                }

                // Create a map of wall types to their margin rates for easier lookup
                const marginRateMap = new Map();
                wallTypes.forEach((wall) => {
                    marginRateMap.set(wall.type, wall.margin);
                });

                // Query the pool_retaining_walls junction table for this customer
                const { data: walls, error } = await supabase
                    .from('pool_retaining_walls')
                    .select(`
                        id,
                        wall_type,
                        height1,
                        height2,
                        length
                    `)
                    .eq('pool_project_id', customerId);

                if (error) {
                    console.error("Error fetching retaining wall data:", error);
                    return { totalMargin: 0 };
                }

                if (!walls || walls.length === 0) {
                    return { totalMargin: 0 };
                }

                let totalMarginAmount = 0;

                // Process each wall from the junction table
                for (const wall of walls) {
                    const wallType = wall.wall_type;
                    const height1 = wall.height1;
                    const height2 = wall.height2;
                    const length = wall.length;

                    // Only include walls that have data
                    if (wallType && height1 && height2 && length) {
                        // Calculate square meters
                        const squareMeters = ((Number(height1) + Number(height2)) / 2) * Number(length);

                        // Extract clean wall type without prefix
                        let displayType = wallType;
                        const wallMatch = wallType.match(/^Wall (\d+): (.*)/);
                        if (wallMatch) {
                            displayType = wallMatch[2].trim();
                        }

                        // Get margin rate from our map based on the clean wall type
                        const marginRate = marginRateMap.get(displayType) || 0;
                        const marginAmount = squareMeters * marginRate;

                        totalMarginAmount += marginAmount;
                    }
                }

                return {
                    totalMargin: parseFloat(totalMarginAmount.toFixed(2))
                };
            } catch (error) {
                console.error("Error calculating retaining walls margin:", error);
                return { totalMargin: 0 };
            }
        },
        enabled: !!customerId
    });

    // Fetch fencing margin data - simplify to only fetch the data, without calculating margin
    const { data: fencingData } = useQuery({
        queryKey: ['fencing-data', customerId],
        queryFn: async () => {
            if (!customerId) return { framelessGlassData: null, flatTopMetalData: null };

            try {
                // Get frameless glass fencing data
                const { data: framelessData, error: framelessError } = await supabase
                    .from('frameless_glass_fencing')
                    .select('*')
                    .eq('customer_id', customerId)
                    .order('created_at', { ascending: false })
                    .limit(1);

                // Get flat top metal fencing data
                const { data: flatTopData, error: flatTopError } = await supabase
                    .from('flat_top_metal_fencing')
                    .select('*')
                    .eq('customer_id', customerId)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if ((framelessError && framelessError.code !== 'PGRST116') ||
                    (flatTopError && flatTopError.code !== 'PGRST116')) {
                    console.error("Error fetching fencing data:", framelessError || flatTopError);
                    return { framelessGlassData: null, flatTopMetalData: null };
                }

                return {
                    framelessGlassData: framelessData && framelessData.length > 0 ? framelessData[0] : null,
                    flatTopMetalData: flatTopData && flatTopData.length > 0 ? flatTopData[0] : null
                };
            } catch (error) {
                console.error("Error fetching fencing data:", error);
                return { framelessGlassData: null, flatTopMetalData: null };
            }
        },
        enabled: !!customerId
    });

    // Add general extras data fetching
    const { data: generalExtras, isLoading: isLoadingGeneralExtras } = useQuery<PoolGeneralExtra[]>({
        queryKey: ['pool-general-extras', customerId],
        queryFn: async () => {
            if (!customerId || !isValidUuid) return [];

            return fetchPoolGeneralExtras(customerId);
        },
        enabled: !!customerId && isValidUuid,
    });

    // Calculate general extras total
    const generalExtrasTotal = generalExtras?.reduce((sum, item) => sum + item.total_rrp, 0) || 0;

    // Group general extras by type
    const generalExtrasByType = {
        spaJets: generalExtras?.filter(item => item.type === 'Spa Jets') || [],
        deckJets: generalExtras?.filter(item => item.type === 'Deck Jets') || [],
        handGrabRail: generalExtras?.filter(item => item.type === 'Hand Grab Rail') || [],
        automation: generalExtras?.filter(item => item.type === 'Automation') || [],
        chemistry: generalExtras?.filter(item => item.type === 'Chemistry') || [],
        bundle: generalExtras?.filter(item => item.type === 'Bundle') || [],
        misc: generalExtras?.filter(item => item.type === 'Misc') || []
    };

    // Show loading state while fetching data
    if (isLoading && isValidUuid) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="flex flex-col items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Loading project summary...</p>
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
    if (error) {
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

    // If no data is available, show a message
    if (!snapshot) {
        return (
            <div className="p-4 text-center space-y-4">
                <h2 className="text-xl font-semibold text-muted-foreground">
                    No Project Data
                </h2>
                <p className="text-muted-foreground">
                    Please select a valid project to view summary information.
                </p>
            </div>
        );
    }

    // Extract breakdown from the price calculator result
    const { basePoolBreakdown, siteRequirementsBreakdown } = priceCalculatorResult;

    // Extract margin percentage from the snapshot
    const marginPct = snapshot.pool_margin_pct || 0;

    // Parse JSON data from the snapshot
    const fixedCosts = snapshot.fixed_costs_json
        ? (typeof snapshot.fixed_costs_json === 'string'
            ? JSON.parse(snapshot.fixed_costs_json)
            : snapshot.fixed_costs_json)
        : [];

    const handoverComponents = snapshot.handover_components
        ? (typeof snapshot.handover_components === 'string'
            ? JSON.parse(snapshot.handover_components)
            : snapshot.handover_components)
        : [];

    const retainingWalls = snapshot.retaining_walls_json
        ? (typeof snapshot.retaining_walls_json === 'string'
            ? JSON.parse(snapshot.retaining_walls_json)
            : snapshot.retaining_walls_json)
        : [];

    // Log the parsed retaining walls to see what's in them
    console.log("Retaining walls data:", retainingWalls);

    // Parse concrete cuts JSON if available
    const concreteCuts = snapshot.concrete_cuts_json
        ? (typeof snapshot.concrete_cuts_json === 'string'
            ? JSON.parse(snapshot.concrete_cuts_json)
            : snapshot.concrete_cuts_json)
        : [];

    // Try to parse site requirements data from multiple formats
    let siteRequirementsData = [];
    try {
        if (snapshot.site_requirements_data) {
            // Log the raw data to understand its structure
            console.log("Raw site_requirements_data:", snapshot.site_requirements_data);

            if (typeof snapshot.site_requirements_data === 'string') {
                siteRequirementsData = JSON.parse(snapshot.site_requirements_data);
            } else if (Array.isArray(snapshot.site_requirements_data)) {
                siteRequirementsData = snapshot.site_requirements_data;
            } else if (typeof snapshot.site_requirements_data === 'object') {
                // If it's an object but not an array, try to convert it to an array if possible
                const entries = Object.entries(snapshot.site_requirements_data);
                if (entries.length > 0) {
                    siteRequirementsData = entries.map(([key, value]) => {
                        if (typeof value === 'object') {
                            return { ...value, id: key };
                        }
                        return { id: key, value };
                    });
                }
            }
        }
    } catch (e) {
        console.error("Error parsing site requirements data:", e);
    }

    // Log the parsed data to check its structure
    console.log("Parsed site requirements data:", siteRequirementsData);

    // Get site requirement names if available from the data
    const siteRequirementsItems = Array.isArray(siteRequirementsData) ? siteRequirementsData : [];
    console.log("Site requirements items:", siteRequirementsItems);

    const craneDetails = siteRequirementsItems.find(item => item.type === 'crane');
    const bobcatDetails = siteRequirementsItems.find(item => item.type === 'bobcat');
    const trafficControlDetails = siteRequirementsItems.find(item => item.type === 'traffic-control');

    console.log("Crane details:", craneDetails);
    console.log("Bobcat details:", bobcatDetails);
    console.log("Traffic control details:", trafficControlDetails);

    // Base crane cost constant
    const BASE_CRANE_COST = 700;

    // Check if siteRequirementsData is in proper format and extract custom requirements
    const customSiteRequirements = Array.isArray(siteRequirementsData) ?
        siteRequirementsData.filter(item => {
            const isStandardType = item.type === 'crane' || item.type === 'bobcat' || item.type === 'traffic-control';
            return !isStandardType; // Include all non-standard items
        }) : [];

    console.log("Custom Site Requirements:", customSiteRequirements);

    // Get totals from the price calculator
    const concretePavingTotal = priceCalculatorResult.totals.concreteTotal;
    const retainingWallsTotal = priceCalculatorResult.totals.retainingWallsTotal;
    const rawFencingTotal = priceCalculatorResult.totals.fencingTotal;
    const waterFeaturesTotal = priceCalculatorResult.totals.waterFeatureTotal;
    const upgradesExtrasTotal = priceCalculatorResult.totals.extrasTotal;

    // Calculate subtotals for upgrades and extras display
    const heatPumpRRP = snapshot.include_heat_pump ? (snapshot.heat_pump_rrp || 0) : 0;
    const heatPumpInstallation = snapshot.include_heat_pump ? (snapshot.heat_pump_installation_cost || 0) : 0;
    const heatPumpTotal = heatPumpRRP + heatPumpInstallation;

    const blanketRollerRRP = snapshot.include_blanket_roller ? (snapshot.blanket_roller_rrp || 0) : 0;
    const blanketRollerInstallation = snapshot.include_blanket_roller ? (snapshot.blanket_roller_installation_cost || 0) : 0;
    const blanketRollerTotal = blanketRollerRRP + blanketRollerInstallation;

    const cleanerTotal = snapshot.cleaner_included ? (snapshot.cleaner_unit_price || 0) : 0;
    const heatingTotal = heatPumpTotal + blanketRollerTotal;
    // Calculate upgrades extras margin based on individual components
    const upgradesExtrasMargin = 0; // Margin is already included in RRP prices

    console.log(snapshot)

    return (
        <MarginVisibilityContext.Provider value={showMargins && !isCustomerView}>
            <div className="space-y-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">Pool Project Price Summary</h2>
                    <div className="flex items-center">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="flex items-center">
                                        <Switch
                                            id="view-mode"
                                            checked={isCustomerView}
                                            onCheckedChange={setIsCustomerView}
                                        />
                                        <div className="ml-2">
                                            {isCustomerView ?
                                                <User className="h-4 w-4 text-gray-600" /> :
                                                <FileText className="h-4 w-4 text-gray-600" />
                                            }
                                        </div>
                                    </div>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="text-xs">
                                    {isCustomerView ? "Presentation View" : "Detailed View"}
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
                <p className="text-muted-foreground mb-6">Complete breakdown of all price components for this pool project</p>

                {/* GRAND TOTAL */}
                <Card className="mb-8 shadow-none border-2 border-primary">
                    <CardContent className="py-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">GRAND TOTAL</h3>
                                    <p className="text-sm text-muted-foreground">Total Price Including All Components</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(priceCalculatorResult.grandTotal)}
                                        </div>
                                        {priceCalculatorResult.totals.discountTotal > 0 && (
                                            <div className="text-sm text-muted-foreground">
                                                Before discounts: {formatCurrency(priceCalculatorResult.grandTotalWithoutDiscounts)}
                                            </div>
                                        )}
                                    </div>
                                    {!hideSubmitButton && <ProjectSubmitButton projectId={customerId} />}
                                </div>
                            </div>
                            
                            {/* Discount Breakdown in Grand Total */}
                            {priceCalculatorResult.discountBreakdown.discountDetails.length > 0 && (
                                <div className="pt-4 border-t border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">Applied Discounts:</h4>
                                    <div className="space-y-1">
                                        {priceCalculatorResult.discountBreakdown.discountDetails.map((discount, index) => (
                                            <div key={index} className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2 text-red-600">
                                                    <Percent className="h-3 w-3" />
                                                    <span>{discount.name}</span>
                                                    {discount.type === 'percentage' && (
                                                        <span className="text-xs text-muted-foreground">
                                                            ({discount.value}%)
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="text-red-600 font-medium">
                                                    -{formatCurrency(discount.calculatedAmount)}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center text-sm font-medium text-red-600 pt-1 border-t border-red-100">
                                            <span>Total Savings:</span>
                                            <span>-{formatCurrency(priceCalculatorResult.totals.discountTotal)}</span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* BASE PRICE SECTION */}
                <Card className="mb-6 shadow-none">
                    <CardContent className="pt-6">
                        <div
                            className={`flex justify-between items-center cursor-pointer ${expandedSections.basePrice ? 'mb-4' : ''}`}
                            onClick={() => toggleSection('basePrice')}
                        >
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Base Price</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-muted-foreground">
                                        Margin: {marginPct}% ({formatCurrency(basePoolBreakdown.totalBeforeMargin * (marginPct / (100 - marginPct)))})
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(priceCalculatorResult.totals.basePoolTotal)}</span>
                                {expandedSections.basePrice ? (
                                    <ChevronUp className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                )}
                            </div>
                        </div>

                        {expandedSections.basePrice && (
                            <div className="space-y-4">
                                <table className="w-full">
                                    <tbody>
                                        <LineItem
                                            label="Pool Shell"
                                            code=""
                                            value={basePoolBreakdown.poolShellPrice}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(basePoolBreakdown.poolShellCost)}` : null}
                                        />
                                        <LineItem
                                            label="Excavation & Truck"
                                            code=""
                                            value={basePoolBreakdown.digPrice}
                                            breakdown={!isCustomerView ?
                                                `Cost: ${formatCurrency(basePoolBreakdown.digCost)}`
                                                : null}
                                        />
                                        <LineItem
                                            label="Filtration Package"
                                            code=""
                                            value={basePoolBreakdown.filtrationPrice}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(basePoolBreakdown.filtrationCost)}` : null}
                                        />
                                        <LineItem
                                            label="Individual Components"
                                            code=""
                                            value={basePoolBreakdown.individualCostsPrice}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(basePoolBreakdown.individualCosts)}` : null}
                                        />
                                        <LineItem
                                            label="Fixed Costs"
                                            code=""
                                            value={basePoolBreakdown.fixedCostsPrice}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(basePoolBreakdown.fixedCostsTotal)}` : null}
                                        />
                                        <LineItem
                                            label="Standard Crane Allowance"
                                            code=""
                                            value={basePoolBreakdown.craneAllowancePrice}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(basePoolBreakdown.craneAllowance)}` : null}
                                        />

                                        {!isCustomerView && (
                                            <>
                                                <SubtotalRow
                                                    label="Base Price Before Margin"
                                                    value={basePoolBreakdown.totalBeforeMargin}
                                                />
                                                <MarginRow
                                                    percentage={marginPct}
                                                />
                                            </>
                                        )}

                                        <TotalRow
                                            label="Base Price Total"
                                            value={priceCalculatorResult.totals.basePoolTotal}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* SITE REQUIREMENTS SECTION */}
                {siteRequirementsBreakdown.totalBeforeMargin > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.siteRequirements ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('siteRequirements')}
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Site Requirements</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin applied to crane only, others have no margin)
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(priceCalculatorResult.totals.siteRequirementsTotal)}</span>
                                    {expandedSections.siteRequirements ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.siteRequirements && (
                                <div className="space-y-4">
                                    <table className="w-full">
                                        <tbody>
                                            {siteRequirementsBreakdown.craneCost > 0 && (
                                                <LineItem
                                                    label={`Crane${craneData?.name ? `: ${craneData.name}` : ''}`}
                                                    code=""
                                                    value={siteRequirementsBreakdown.cranePrice}
                                                    breakdown={!isCustomerView ?
                                                        `Cost: ${formatCurrency(siteRequirementsBreakdown.craneCost)}`
                                                        : null}
                                                />
                                            )}
                                            {siteRequirementsBreakdown.bobcatCost > 0 && (
                                                <LineItem
                                                    label={`Bobcat${bobcatData ? `: ${bobcatData?.size_category || ''} - ${bobcatData?.day_code || ''}` : ''}`}
                                                    code=""
                                                    value={siteRequirementsBreakdown.bobcatPrice}
                                                    breakdown={!isCustomerView ?
                                                        `Cost: ${formatCurrency(siteRequirementsBreakdown.bobcatCost)}`
                                                        : null}
                                                />
                                            )}
                                            {siteRequirementsBreakdown.trafficControlCost > 0 && (
                                                <LineItem
                                                    label={`Traffic Control${trafficControlData?.name ? `: ${trafficControlData?.name}` : ''}`}
                                                    code=""
                                                    value={siteRequirementsBreakdown.trafficControlPrice}
                                                    breakdown={!isCustomerView ?
                                                        `Cost: ${formatCurrency(siteRequirementsBreakdown.trafficControlCost)}`
                                                        : null}
                                                />
                                            )}
                                            {siteRequirementsBreakdown.customRequirementsCost > 0 && (
                                                <LineItem
                                                    label="Custom Requirements"
                                                    code=""
                                                    value={siteRequirementsBreakdown.customRequirementsPrice}
                                                    breakdown={!isCustomerView ? `Cost: ${formatCurrency(siteRequirementsBreakdown.customRequirementsCost)}` : null}
                                                />
                                            )}

                                            <TotalRow
                                                label="Site Requirements Total"
                                                value={priceCalculatorResult.totals.siteRequirementsTotal}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* CONCRETE & PAVING SECTION */}
                {concretePavingTotal > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.concretePaving ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('concretePaving')}
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Concrete & Paving</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin Already Included)
                                            {concretePavingMarginData?.totalMargin > 0 &&
                                                ` (${formatCurrency(concretePavingMarginData.totalMargin)} margin)`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(concretePavingTotal)}</span>
                                    {expandedSections.concretePaving ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.concretePaving && (
                                <div className="space-y-4">
                                    <table className="w-full">
                                        <tbody>
                                            {(snapshot.concrete_cuts_cost || 0) > 0 && (
                                                <LineItem
                                                    label="Concrete Cuts"
                                                    code=""
                                                    value={snapshot.concrete_cuts_cost || 0}
                                                    breakdown={!isCustomerView && concreteCutsData && concreteCutsData.length > 0 ?
                                                        concreteCutsData.map(cut => cut.cut_type).join(', ') :
                                                        null}
                                                />
                                            )}
                                            {(snapshot.extra_paving_cost || 0) > 0 && (
                                                <LineItem
                                                    label={`Extra Paving${pavingData?.extraPavingCategory ? `: ${pavingData.extraPavingCategory}` : ''}`}
                                                    code=""
                                                    value={snapshot.extra_paving_cost || 0}
                                                    breakdown={null}
                                                />
                                            )}
                                            {(snapshot.existing_paving_cost || 0) > 0 && (
                                                <LineItem
                                                    label={`Paving on Existing Concrete${pavingData?.existingPavingCategory ? `: ${pavingData.existingPavingCategory}` : ''}`}
                                                    code=""
                                                    value={snapshot.existing_paving_cost || 0}
                                                    breakdown={null}
                                                />
                                            )}
                                            {(snapshot.extra_concreting_cost || 0) > 0 && (
                                                <LineItem
                                                    label={`Extra Concreting${pavingData?.extraConcretingType ? `: ${pavingData.extraConcretingType}` : ''}`}
                                                    code=""
                                                    value={snapshot.extra_concreting_cost || 0}
                                                    breakdown={null}
                                                />
                                            )}
                                            {(snapshot.concrete_pump_total_cost || 0) > 0 && (
                                                <LineItem
                                                    label="Concrete Pump"
                                                    code=""
                                                    value={snapshot.concrete_pump_total_cost || 0}
                                                    breakdown={!isCustomerView && concretePumpData?.concrete_pump_quantity ?
                                                        `${concretePumpData.concrete_pump_quantity} pump setup${concretePumpData.concrete_pump_quantity > 1 ? 's' : ''}` : null}
                                                />
                                            )}
                                            {(snapshot.uf_strips_cost || 0) > 0 && (
                                                <LineItem
                                                    label="Under Fence Strips"
                                                    code=""
                                                    value={snapshot.uf_strips_cost || 0}
                                                    breakdown={null}
                                                />
                                            )}
                                            <TotalRow
                                                label="Concrete & Paving Total"
                                                value={concretePavingTotal}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* RETAINING WALLS SECTION */}
                {retainingWallsTotal > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.retainingWalls ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('retainingWalls')}
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Retaining Walls</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin Already Included)
                                            {retainingWallsMarginData?.totalMargin > 0 &&
                                                ` (${formatCurrency(retainingWallsMarginData.totalMargin)} margin)`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(retainingWallsTotal)}</span>
                                    {expandedSections.retainingWalls ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.retainingWalls && (
                                <div className="space-y-4">
                                    <table className="w-full">
                                        <tbody>
                                            {Array.isArray(retainingWalls) && retainingWalls.map((wall, index) => (
                                                <LineItem
                                                    key={`wall-${index}`}
                                                    label={wall.description || `Retaining Wall ${index + 1}`}
                                                    code=""
                                                    value={wall.total_cost || 0}
                                                    breakdown={!isCustomerView && wall.length ? `Length: ${wall.length}m` : null}
                                                />
                                            ))}
                                            <TotalRow
                                                label="Retaining Walls Total"
                                                value={retainingWallsTotal}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* FENCING SECTION */}
                {snapshot.fencing_total_cost > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.fencing ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('fencing')}
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Fencing</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin Already Included)
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(rawFencingTotal)}</span>
                                    {expandedSections.fencing ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.fencing && (
                                <div className="space-y-4">
                                    <table className="w-full">
                                        <tbody>
                                            {/* Frameless Glass Fencing */}
                                            {fencingData?.framelessGlassData?.linear_meters > 0 && (
                                                <>
                                                    <tr className="border-b border-gray-100 font-medium">
                                                        <td className="p-2 text-left" colSpan={3}>Frameless Glass Fencing</td>
                                                    </tr>

                                                    {fencingData.framelessGlassData.linear_meters > 0 && (
                                                        <LineItem
                                                            label="Linear Meters"
                                                            code=""
                                                            value={fencingData.framelessGlassData.linear_meters * 195}
                                                            breakdown={`${fencingData.framelessGlassData.linear_meters}m × $195`}
                                                        />
                                                    )}

                                                    {fencingData.framelessGlassData.gates > 0 && (
                                                        <LineItem
                                                            label="Gates"
                                                            code=""
                                                            value={Math.max(0, fencingData.framelessGlassData.gates - 1) * 385}
                                                            breakdown={`${fencingData.framelessGlassData.gates} gates ($385 each, first gate free)`}
                                                        />
                                                    )}

                                                    {fencingData.framelessGlassData.simple_panels > 0 && (
                                                        <LineItem
                                                            label="Simple Panels"
                                                            code=""
                                                            value={fencingData.framelessGlassData.simple_panels * 220}
                                                            breakdown={`${fencingData.framelessGlassData.simple_panels} panels × $220`}
                                                        />
                                                    )}

                                                    {fencingData.framelessGlassData.complex_panels > 0 && (
                                                        <LineItem
                                                            label="Complex Panels"
                                                            code=""
                                                            value={fencingData.framelessGlassData.complex_panels * 385}
                                                            breakdown={`${fencingData.framelessGlassData.complex_panels} panels × $385`}
                                                        />
                                                    )}

                                                    {fencingData.framelessGlassData.earthing_required && (
                                                        <LineItem
                                                            label="Earthing"
                                                            code=""
                                                            value={40}
                                                            breakdown="Required"
                                                        />
                                                    )}

                                                    <SubtotalRow
                                                        label="Frameless Glass Fencing Subtotal"
                                                        value={fencingData.framelessGlassData.total_cost}
                                                    />
                                                </>
                                            )}

                                            {/* Flat Top Metal Fencing */}
                                            {fencingData?.flatTopMetalData?.linear_meters > 0 && (
                                                <>
                                                    <tr className="border-b border-gray-100 font-medium mt-2">
                                                        <td className="p-2 text-left" colSpan={3}>Flat Top Metal Fencing</td>
                                                    </tr>

                                                    {fencingData.flatTopMetalData.linear_meters > 0 && (
                                                        <LineItem
                                                            label="Linear Meters"
                                                            code=""
                                                            value={fencingData.flatTopMetalData.linear_meters * 165}
                                                            breakdown={`${fencingData.flatTopMetalData.linear_meters}m × $165`}
                                                        />
                                                    )}

                                                    {fencingData.flatTopMetalData.gates > 0 && (
                                                        <LineItem
                                                            label="Gates"
                                                            code=""
                                                            value={fencingData.flatTopMetalData.gates * 297}
                                                            breakdown={`${fencingData.flatTopMetalData.gates} gates × $297`}
                                                        />
                                                    )}

                                                    {fencingData.flatTopMetalData.simple_panels > 0 && (
                                                        <LineItem
                                                            label="Simple Panels"
                                                            code=""
                                                            value={fencingData.flatTopMetalData.simple_panels * 220}
                                                            breakdown={`${fencingData.flatTopMetalData.simple_panels} panels × $220`}
                                                        />
                                                    )}

                                                    {fencingData.flatTopMetalData.complex_panels > 0 && (
                                                        <LineItem
                                                            label="Complex Panels"
                                                            code=""
                                                            value={fencingData.flatTopMetalData.complex_panels * 385}
                                                            breakdown={`${fencingData.flatTopMetalData.complex_panels} panels × $385`}
                                                        />
                                                    )}

                                                    {fencingData.flatTopMetalData.earthing_required && (
                                                        <LineItem
                                                            label="Earthing"
                                                            code=""
                                                            value={150}
                                                            breakdown="Required"
                                                        />
                                                    )}

                                                    <SubtotalRow
                                                        label="Flat Top Metal Fencing Subtotal"
                                                        value={fencingData.flatTopMetalData.total_cost}
                                                    />
                                                </>
                                            )}

                                            <TotalRow
                                                label="Fencing Total"
                                                value={rawFencingTotal}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* ELECTRICAL SECTION */}
                {snapshot.elec_total_cost > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.electrical ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('electrical')}
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Electrical</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin Already Included)
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(snapshot.elec_total_cost)}</span>
                                    {expandedSections.electrical ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.electrical && (
                                <div className="space-y-4">
                                    <table className="w-full">
                                        <tbody>
                                            {snapshot.elec_standard_power_flag && (snapshot.elec_standard_power_rate || 0) > 0 && (
                                                <LineItem
                                                    label="Standard Power"
                                                    code=""
                                                    value={snapshot.elec_standard_power_rate || 0}
                                                    breakdown={null}
                                                />
                                            )}
                                            {snapshot.elec_fence_earthing_flag && (snapshot.elec_fence_earthing_rate || 0) > 0 && (
                                                <LineItem
                                                    label="Add on Fence Earthing"
                                                    code=""
                                                    value={snapshot.elec_fence_earthing_rate || 0}
                                                    breakdown={null}
                                                />
                                            )}
                                            {snapshot.elec_heat_pump_circuit_flag && (snapshot.elec_heat_pump_circuit_rate || 0) > 0 && (
                                                <LineItem
                                                    label="Heat Pump Circuit"
                                                    code=""
                                                    value={snapshot.elec_heat_pump_circuit_rate || 0}
                                                    breakdown={null}
                                                />
                                            )}
                                            <TotalRow
                                                label="Electrical Total"
                                                value={snapshot.elec_total_cost}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* WATER FEATURES SECTION */}
                {waterFeaturesTotal > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.waterFeatures ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('waterFeatures')}
                            >
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Water Features</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin Already Included)
                                            {` (${formatCurrency(1300)} margin)`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(waterFeaturesTotal)}</span>
                                    {expandedSections.waterFeatures ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.waterFeatures && (
                                <div className="space-y-4">
                                    <table className="w-full">
                                        <tbody>
                                            <LineItem
                                                label="Water Feature Base"
                                                code=""
                                                value={3500}
                                                breakdown={!isCustomerView ? "Includes $900 margin" : null}
                                            />
                                            <LineItem
                                                label="Back Cladding"
                                                code=""
                                                value={1000}
                                                breakdown={!isCustomerView ? "Includes $300 margin" : null}
                                            />
                                            <LineItem
                                                label="900mm LED Blade"
                                                code=""
                                                value={300}
                                                breakdown={!isCustomerView ? "Includes $100 margin" : null}
                                            />
                                            <TotalRow
                                                label="Water Features Total"
                                                value={waterFeaturesTotal}
                                            />
                                            {!isCustomerView && (
                                                <tr className="bg-gray-50 text-sm text-muted-foreground">
                                                    <td colSpan={3} className="p-2 text-center italic">
                                                        All prices include margin — no additional markup needed
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* UPGRADES & EXTRAS - GENERAL SECTION */}
                <Card className="mb-6 shadow-none">
                    <CardContent className="pt-6">
                        <div
                            className={`flex justify-between items-center cursor-pointer ${expandedSections.upgradesExtrasGeneral ? 'mb-4' : ''}`}
                            onClick={() => toggleSection('upgradesExtrasGeneral')}
                        >
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Upgrades & Extras - General</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-muted-foreground">
                                        (Margin Already Included)
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(generalExtrasTotal)}</span>
                                {expandedSections.upgradesExtrasGeneral ? (
                                    <ChevronUp className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                )}
                            </div>
                        </div>

                        {expandedSections.upgradesExtrasGeneral && (
                            <div className="space-y-4">
                                <table className="w-full">
                                    <tbody>
                                        {generalExtrasTotal === 0 ? (
                                            <tr className="border-b border-slate-100">
                                                <td className="p-2 text-center text-muted-foreground" colSpan={3}>
                                                    No general upgrades or extras selected
                                                </td>
                                            </tr>
                                        ) : (
                                            <>
                                                {generalExtrasByType.spaJets.map((item) => (
                                                    <LineItem
                                                        key={item.id}
                                                        label={`Spa Jets - ${item.name}`}
                                                        code={item.sku}
                                                        value={item.total_rrp}
                                                        breakdown={!isCustomerView ? `${item.quantity} units × ${formatCurrency(item.rrp)}` : null}
                                                    />
                                                ))}

                                                {generalExtrasByType.deckJets.map((item) => (
                                                    <LineItem
                                                        key={item.id}
                                                        label={`Deck Jets - ${item.name}`}
                                                        code={item.sku}
                                                        value={item.total_rrp}
                                                        breakdown={!isCustomerView ? item.description : null}
                                                    />
                                                ))}

                                                {generalExtrasByType.handGrabRail.map((item) => (
                                                    <LineItem
                                                        key={item.id}
                                                        label={`Hand Grab Rail - ${item.name}`}
                                                        code={item.sku}
                                                        value={item.total_rrp}
                                                        breakdown={!isCustomerView ? item.description : null}
                                                    />
                                                ))}

                                                {generalExtrasByType.automation.map((item) => (
                                                    <LineItem
                                                        key={item.id}
                                                        label={`Pool Automation - ${item.name}`}
                                                        code={item.sku}
                                                        value={item.total_rrp}
                                                        breakdown={!isCustomerView ? item.description : null}
                                                    />
                                                ))}

                                                {generalExtrasByType.chemistry.map((item) => (
                                                    <LineItem
                                                        key={item.id}
                                                        label={`pH & ORP Chemistry - ${item.name}`}
                                                        code={item.sku}
                                                        value={item.total_rrp}
                                                        breakdown={!isCustomerView ? item.description : null}
                                                    />
                                                ))}

                                                {generalExtrasByType.bundle.map((item) => (
                                                    <LineItem
                                                        key={item.id}
                                                        label={`Bundle - ${item.name}`}
                                                        code={item.sku}
                                                        value={item.total_rrp}
                                                        breakdown={!isCustomerView ? `${item.description} (Bundle Discount Applied)` : null}
                                                    />
                                                ))}

                                                {generalExtrasByType.misc.map((item) => (
                                                    <LineItem
                                                        key={item.id}
                                                        label={`Additional - ${item.name}`}
                                                        code={item.sku}
                                                        value={item.total_rrp}
                                                        breakdown={!isCustomerView ? `${item.quantity} units × ${formatCurrency(item.rrp)}` : null}
                                                    />
                                                ))}
                                                
                                                {generalExtrasTotal > 0 && (
                                                    <TotalRow
                                                        label="General Extras Total"
                                                        value={generalExtrasTotal}
                                                    />
                                                )}
                                            </>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* UPGRADES & EXTRAS - HEATING SECTION */}
                {heatingTotal > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.upgradesExtrasHeating ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('upgradesExtrasHeating')}
                            >
                                <div>
                                    <h3 className="text-gray-900 text-lg font-medium">Upgrades & Extras - Heating</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin Already Included)
                                            {upgradesExtrasMargin > 0 && ` (${formatCurrency(upgradesExtrasMargin)} margin)`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(heatingTotal)}</span>
                                    {expandedSections.upgradesExtrasHeating ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.upgradesExtrasHeating && (
                                <div className="space-y-4">
                                    <div className="p-0">
                                        <table className="w-full">
                                            <tbody>
                                                {snapshot.include_heat_pump && (
                                                    <>
                                                        <LineItem
                                                            label="Heat Pump"
                                                            code=""
                                                            value={heatPumpRRP}
                                                            breakdown={!isCustomerView ? "Price includes margin" : null}
                                                        />
                                                        <LineItem
                                                            label="Heat Pump Installation"
                                                            code=""
                                                            value={heatPumpInstallation}
                                                            breakdown={!isCustomerView ? "Included in heat pump price" : null}
                                                        />
                                                    </>
                                                )}
                                                {snapshot.include_blanket_roller && (
                                                    <>
                                                        <LineItem
                                                            label="Pool Blanket & Roller"
                                                            code=""
                                                            value={blanketRollerRRP}
                                                            breakdown={!isCustomerView ? "Price includes margin" : null}
                                                        />
                                                        <LineItem
                                                            label="Blanket & Roller Installation"
                                                            code=""
                                                            value={blanketRollerInstallation}
                                                            breakdown={!isCustomerView ? "Included in blanket & roller price" : null}
                                                        />
                                                    </>
                                                )}
                                                <TotalRow
                                                    label="Heating Upgrades Total"
                                                    value={heatingTotal}
                                                />
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* UPGRADES & EXTRAS - POOL CLEANER SECTION */}
                {cleanerTotal > 0 && (
                    <Card className="mb-6 shadow-none">
                        <CardContent className="pt-6">
                            <div
                                className={`flex justify-between items-center cursor-pointer ${expandedSections.upgradesExtrasCleaner ? 'mb-4' : ''}`}
                                onClick={() => toggleSection('upgradesExtrasCleaner')}
                            >
                                <div>
                                    <h3 className="text-gray-900 text-lg font-medium">Upgrades & Extras - Pool Cleaner</h3>
                                    {!isCustomerView && (
                                        <p className="text-sm text-muted-foreground">
                                            (Margin Already Included)
                                            {upgradesExtrasMargin > 0 && ` (${formatCurrency(upgradesExtrasMargin)} margin)`}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center">
                                    <span className="mr-4 font-semibold">{formatCurrency(cleanerTotal)}</span>
                                    {expandedSections.upgradesExtrasCleaner ? (
                                        <ChevronUp className="h-5 w-5 text-gray-600" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-600" />
                                    )}
                                </div>
                            </div>

                            {expandedSections.upgradesExtrasCleaner && (
                                <div className="space-y-4">
                                    <div className="p-0">
                                        <table className="w-full">
                                            <tbody>
                                                {snapshot.cleaner_included && (
                                                    <>
                                                        <LineItem
                                                            label="Pool Cleaner"
                                                            code=""
                                                            value={snapshot.cleaner_unit_price || 0}
                                                            breakdown={!isCustomerView ? "Price includes margin" : null}
                                                        />
                                                    </>
                                                )}
                                                <TotalRow
                                                    label="Pool Cleaner Total"
                                                    value={cleanerTotal}
                                                />
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* DISCOUNTS SECTION */}
                <Card className="mb-6 shadow-none">
                    <CardContent className="pt-6">
                        <div
                            className={`flex justify-between items-center cursor-pointer ${expandedSections.discounts ? 'mb-4' : ''}`}
                            onClick={() => toggleSection('discounts')}
                        >
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Discounts</h3>
                                <p className="text-sm text-muted-foreground">
                                    Select promotional discounts to apply to this pool project
                                </p>
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">
                                    {getAppliedDiscountsWithDetails()?.length || 0} Applied
                                </span>
                                {expandedSections.discounts ? (
                                    <ChevronUp className="h-5 w-5 text-gray-600" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-gray-600" />
                                )}
                            </div>
                        </div>

                        {expandedSections.discounts && (
                            <div className="space-y-4">
                                {/* Discount Selection */}
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select Discount Promotion
                                        </label>
                                        <Select 
                                            value={selectedDiscountId} 
                                            onValueChange={setSelectedDiscountId}
                                            disabled={isLoadingPromotions}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choose a discount promotion" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availablePromotions?.filter(promotion => 
                                                    !isDiscountApplied(promotion.uuid)
                                                ).map((promotion) => (
                                                    <SelectItem key={promotion.uuid} value={promotion.uuid}>
                                                        <div className="flex items-center justify-between w-full">
                                                            <span>{promotion.discount_name}</span>
                                                            <div className="flex items-center gap-2 ml-4">
                                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                                                    promotion.discount_type === 'dollar' 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-blue-100 text-blue-800'
                                                                }`}>
                                                                    {promotion.discount_type === 'dollar' ? 'Dollar' : 'Percentage'}
                                                                </span>
                                                                <span className="font-semibold">
                                                                    {promotion.discount_type === 'dollar' 
                                                                        ? formatCurrency(promotion.dollar_value || 0)
                                                                        : `${promotion.percentage_value || 0}%`
                                                                    }
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button 
                                        onClick={() => {
                                            if (selectedDiscountId && customerId) {
                                                addDiscount({
                                                    pool_project_id: customerId,
                                                    discount_promotion_uuid: selectedDiscountId
                                                });
                                                setSelectedDiscountId('');
                                            }
                                        }}
                                        disabled={!selectedDiscountId || isAddingDiscount || !customerId}
                                    >
                                        {isAddingDiscount ? "Adding..." : "Add Discount"}
                                    </Button>
                                </div>

                                {/* Applied Discounts List */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700">Applied Discounts</h4>
                                    {isLoadingPoolDiscounts ? (
                                        <div className="text-sm text-gray-500">Loading applied discounts...</div>
                                    ) : getAppliedDiscountsWithDetails()?.length === 0 ? (
                                        <div className="text-sm text-gray-500 italic">No discounts applied yet</div>
                                    ) : (
                                        <div className="space-y-2">
                                            {getAppliedDiscountsWithDetails()?.map((poolDiscount: any) => {
                                                const promotion = poolDiscount.discount_promotion;
                                                return (
                                                    <div 
                                                        key={poolDiscount.id} 
                                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Percent className="h-4 w-4 text-gray-600" />
                                                            <div>
                                                                <div className="font-medium">{promotion.discount_name}</div>
                                                                <div className="text-sm text-gray-600">
                                                                    {promotion.discount_type === 'dollar' 
                                                                        ? `${formatCurrency(promotion.dollar_value || 0)} discount`
                                                                        : `${promotion.percentage_value || 0}% discount`
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeDiscount(poolDiscount.id)}
                                                            disabled={isRemovingDiscount}
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

            </div>
        </MarginVisibilityContext.Provider>
    );
}; 