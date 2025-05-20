import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { PackageWithComponents } from '@/types/filtration';
import { Pool } from '@/types/pool';
import {
    calculateConcreteCutsMargin,
    calculateConcretePumpMargin,
    calculateExtraConcretingMargin,
    calculateExtraPavingMargin,
    calculateUnderFenceStripsMargin
} from '@/utils/concrete-margin-calculations';
import { fetchConcreteAndPavingData } from '@/utils/concrete-paving-data';
import { formatCurrency } from '@/utils/format';
import { calculatePackagePrice } from '@/utils/package-calculations';
import { validateUuid } from '@/utils/validators';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, FileText, Loader2, User } from 'lucide-react';
import React, { createContext, useState } from 'react';

// Define the shape of the snapshot data from proposal_snapshot_v
interface ProjectSnapshot {
    id: string;
    project_id: string;
    pool_specification_id: string;
    pool_margin_pct: number;
    spec_buy_inc_gst: number;
    fixed_costs: number;
    fixed_costs_json: string;
    pc_beam: number;
    pc_coping_supply: number;
    pc_coping_lay: number;
    pc_salt_bags: number;
    pc_trucked_water: number;
    pc_misc: number;
    pc_pea_gravel: number;
    pc_install_fee: number;
    crane_cost: number;
    bobcat_cost: number;
    traffic_control_cost: number;
    dig_excavation_rate: number;
    dig_excavation_hours: number;
    dig_truck_rate: number;
    dig_truck_hours: number;
    dig_truck_qty: number;
    site_requirements_total: number;
    elec_total_cost: number;
    elec_standard_power_flag: boolean;
    elec_fence_earthing_flag: boolean;
    elec_heat_pump_circuit_flag: boolean;
    elec_standard_power_rate: number;
    elec_fence_earthing_rate: number;
    elec_heat_pump_circuit_rate: number;
    pump_price_inc_gst: number;
    filter_price_inc_gst: number;
    sanitiser_price_inc_gst: number;
    light_price_inc_gst: number;
    handover_components: string;
    concrete_cuts_cost: number;
    concrete_cuts_json: string;
    extra_paving_cost: number;
    existing_paving_cost: number;
    extra_concreting_cost: number;
    concrete_pump_total_cost: number;
    uf_strips_cost: number;
    fencing_total_cost: number;
    water_feature_total_cost: number;
    retaining_walls_json: string;
    cleaner_included: boolean;
    cleaner_unit_price: number;
    cleaner_cost_price: number;
    include_heat_pump: boolean;
    include_blanket_roller: boolean;
    heat_pump_cost: number;
    blanket_roller_cost: number;
    upgrades_extras_total: number;
    site_requirements_data: string;
    heat_pump_rrp: number;
    heat_pump_installation_cost: number;
    blanket_roller_rrp: number;
    blanket_roller_installation_cost: number;
};

export const MarginVisibilityContext = createContext<boolean>(false);

interface SummarySectionProps {
    showMargins?: boolean;
}

// Line item component for detailed cost breakdowns
const LineItem = ({ label, code, value, breakdown = null }) => (
    <tr className="border-b border-slate-100">
        <td className="p-2 text-left">
            {label} {code && code.indexOf('_') === -1 && <span className="text-muted-foreground text-sm">({code})</span>}
        </td>
        <td className="p-2 text-right">{formatCurrency(value)}</td>
        {breakdown && <td className="p-2 text-left text-muted-foreground text-sm">{breakdown}</td>}
        {!breakdown && <td></td>}
    </tr>
);

// Subtotal row for sections
const SubtotalRow = ({ label, value }) => (
    <tr className="border-b border-slate-200 font-medium">
        <td className="p-2 text-left">{label}</td>
        <td className="p-2 text-right">{formatCurrency(value)}</td>
        <td></td>
    </tr>
);

// Margin row showing percentage and calculation
const MarginRow = ({ percentage, formula = "Formula: Cost ÷ (1 - margin %)" }) => (
    <tr className="border-b border-slate-100">
        <td className="p-2 text-left">Margin Applied</td>
        <td className="p-2 text-right">{percentage}%</td>
        <td className="p-2 text-left text-muted-foreground text-sm">{formula}</td>
    </tr>
);

// Total row with background highlight
const TotalRow = ({ label, value }) => (
    <tr className="bg-slate-200 font-bold">
        <td className="p-2 text-left">{label}</td>
        <td className="p-2 text-right text-primary">{formatCurrency(value)}</td>
        <td></td>
    </tr>
);

// Section card component for each section (Pool, Installation, etc)
const SectionCard = ({ title, children, marginIncluded = false }) => (
    <Card className="mb-6 shadow-sm">
        <CardHeader className="py-3 px-4 bg-white border-b border-slate-200">
            <CardTitle className="text-primary text-lg">
                {title} {marginIncluded && "(Margin Included)"}
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <div className="p-0">
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
        <div className="text-sm text-slate-600">
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
        upgradesExtrasCleaner: false
    });

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

    // Fetch project snapshot data
    const { data: snapshot, isLoading, error } = useQuery<ProjectSnapshot | null>({
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
                return data as unknown as ProjectSnapshot;
            } catch (error) {
                console.error("Error in project snapshot query:", error);
                return null;
            }
        },
        enabled: !!customerId && isValidUuid,
    });

    // Get pool specification data if a specification is selected
    const { data: pool } = useQuery({
        queryKey: ['pool-specification', snapshot?.pool_specification_id],
        queryFn: async () => {
            if (!snapshot?.pool_specification_id) return null;

            try {
                const { data, error } = await supabase
                    .from('pool_specifications')
                    .select('*')
                    .eq('id', snapshot.pool_specification_id)
                    .single();

                if (error) {
                    console.error("Error fetching pool specification:", error);
                    return null;
                }

                return data as Pool;
            } catch (error) {
                console.error("Error fetching pool specification:", error);
                return null;
            }
        },
        enabled: !!snapshot?.pool_specification_id,
    });

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

    // Helper functions for price calculations
    const calcMargin = (cost, pct) => cost * (pct / 100);
    const calcTotal = (cost, pct) => cost / (1 - (pct / 100));

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

    // Fixed costs total
    const fixedCostsTotal = fixedCosts.reduce((sum, cost) => sum + (cost.price || 0), 0);

    // Simplified data for site requirements display
    const siteRequirementsTotal = snapshot.site_requirements_total || 0;

    // Calculations for base price components
    const BASE_CRANE_COST = 700;

    // Calculate components before applying margin
    const poolShellCost = snapshot.spec_buy_inc_gst || 0;

    const digCost = (snapshot.dig_excavation_rate || 0) * (snapshot.dig_excavation_hours || 0) +
        ((snapshot.dig_truck_rate || 0) * (snapshot.dig_truck_hours || 0) * (snapshot.dig_truck_qty || 0));

    // Create a temporary package object to use with calculatePackagePrice
    const packageObj: PackageWithComponents = {
        id: 'temp-id',
        name: 'Temporary Package',
        display_order: 0,
        pump: snapshot.pump_price_inc_gst ? {
            id: 'pump-id',
            name: 'Pump',
            model_number: '',
            price_inc_gst: snapshot.pump_price_inc_gst || 0
        } : null,
        filter: snapshot.filter_price_inc_gst ? {
            id: 'filter-id',
            name: 'Filter',
            model_number: '',
            price_inc_gst: snapshot.filter_price_inc_gst || 0
        } : null,
        sanitiser: snapshot.sanitiser_price_inc_gst ? {
            id: 'sanitiser-id',
            name: 'Sanitiser',
            model_number: '',
            price_inc_gst: snapshot.sanitiser_price_inc_gst || 0
        } : null,
        light: snapshot.light_price_inc_gst ? {
            id: 'light-id',
            name: 'Light',
            model_number: '',
            price_inc_gst: snapshot.light_price_inc_gst || 0
        } : null,
        handover_kit: handoverComponents.length ? {
            id: 'handover-kit-id',
            name: 'Handover Kit',
            components: handoverComponents.map(comp => ({
                id: comp.id || 'component-id',
                package_id: 'package-id',
                component_id: comp.id || 'component-id',
                quantity: comp.hk_component_quantity || 0,
                created_at: '',
                component: {
                    id: comp.id || 'component-id',
                    name: comp.hk_component_name || '',
                    model_number: '',
                    price_inc_gst: comp.hk_component_price_inc_gst || 0
                }
            }))
        } : null
    };

    // Use the consistent calculatePackagePrice function
    const filtrationCost = calculatePackagePrice(packageObj);

    const individualCosts = (snapshot.pc_beam || 0) +
        (snapshot.pc_coping_supply || 0) +
        (snapshot.pc_coping_lay || 0) +
        (snapshot.pc_salt_bags || 0) +
        (snapshot.pc_trucked_water || 0) +
        (snapshot.pc_misc || 0) +
        (snapshot.pc_pea_gravel || 0) +
        (snapshot.pc_install_fee || 0);

    // Calculate total base price before margin
    const basePriceBeforeMargin =
        poolShellCost +
        digCost +
        filtrationCost +
        individualCosts +
        fixedCostsTotal;

    // Apply margin to each component using calcTotal function
    const poolShellPrice = calcTotal(poolShellCost, marginPct);
    const digPrice = calcTotal(digCost, marginPct);
    const filtrationPrice = calcTotal(filtrationCost, marginPct);
    const individualCostsTotal = calcTotal(individualCosts, marginPct);

    // Calculate margin amount
    const marginAmount = basePriceBeforeMargin * (marginPct / (100 - marginPct));

    // Calculate base price total with margin using calcTotal function
    const basePriceTotal = calcTotal(basePriceBeforeMargin, marginPct);

    // Site Requirements calculations
    const craneCost = snapshot.crane_cost || 0;

    // If crane cost is > 0 but not exactly equal to BASE_CRANE_COST, 
    // calculate the difference (additional cost beyond base)
    let adjustedCraneCost = 0;
    if (craneCost > 0) {
        // Subtract base crane cost (only if it's more than the base cost)
        adjustedCraneCost = craneCost > BASE_CRANE_COST ? craneCost - BASE_CRANE_COST : craneCost;
    }

    const bobcatCost = snapshot.bobcat_cost || 0;
    const trafficControlCost = snapshot.traffic_control_cost || 0;

    // Check if siteRequirementsData is in proper format and extract custom requirements
    // Include all items that don't have a specific type (crane, bobcat, traffic-control) as custom
    const customSiteRequirements = Array.isArray(siteRequirementsData) ?
        siteRequirementsData.filter(item => {
            const isStandardType = item.type === 'crane' || item.type === 'bobcat' || item.type === 'traffic-control';
            return !isStandardType; // Include all non-standard items
        }) : [];

    console.log("Custom Site Requirements:", customSiteRequirements);

    // Calculate total of custom site requirements
    const customSiteRequirementsCost = customSiteRequirements.reduce((total, item) => {
        const itemCostRaw = typeof item.price === 'string' ?
            parseFloat(item.price || '0') :
            (typeof item.price === 'number' ? item.price : 0);

        console.log(`Custom Item: ${item.description || item.name || "Custom Requirement"}, Price: ${itemCostRaw}`);
        return total + itemCostRaw;
    }, 0);

    console.log("Custom Site Requirements Total Cost:", customSiteRequirementsCost);

    // Calculate total additional site requirements (those not covered by individual items)
    const additionalSiteRequirementsCost = snapshot.site_requirements_total ?
        snapshot.site_requirements_total - customSiteRequirementsCost : 0;

    // Total cost before margin
    const siteRequirementsBeforeMargin =
        adjustedCraneCost +
        bobcatCost +
        trafficControlCost +
        customSiteRequirementsCost +
        (additionalSiteRequirementsCost > 0 ? additionalSiteRequirementsCost : 0);

    // Apply margin to components
    const cranePriceWithMargin = calcTotal(adjustedCraneCost, marginPct);
    const bobcatPriceWithMargin = calcTotal(bobcatCost, marginPct);
    const trafficControlPriceWithMargin = calcTotal(trafficControlCost, marginPct);
    const customSiteRequirementsPriceWithMargin = calcTotal(customSiteRequirementsCost, marginPct);
    const additionalSiteRequirementsPriceWithMargin = additionalSiteRequirementsCost > 0 ?
        calcTotal(additionalSiteRequirementsCost, marginPct) : 0;

    // Calculate site requirements total with margin
    const siteRequirementsTotalWithMargin = calcTotal(siteRequirementsBeforeMargin, marginPct);

    // Calculate site requirements margin amount
    const siteRequirementsMarginAmount = siteRequirementsBeforeMargin * (marginPct / (100 - marginPct));

    // Concrete & Paving calculations
    const concreteCutsCost = snapshot.concrete_cuts_cost || 0;
    const extraPavingCost = snapshot.extra_paving_cost || 0;
    const existingPavingCost = snapshot.existing_paving_cost || 0;
    const extraConcretingCost = snapshot.extra_concreting_cost || 0;
    const concretePumpTotalCost = snapshot.concrete_pump_total_cost || 0;
    const ufStripsCost = snapshot.uf_strips_cost || 0;

    // Log the values to debug
    console.log("Concrete & Paving Values:", {
        concreteCutsCost,
        extraPavingCost,
        existingPavingCost,
        extraConcretingCost,
        concretePumpTotalCost,
        ufStripsCost,
        fullSnapshot: snapshot
    });

    // Calculate total concrete & paving cost
    const concretePavingTotal =
        concreteCutsCost +
        extraPavingCost +
        existingPavingCost +
        extraConcretingCost +
        concretePumpTotalCost +
        ufStripsCost;

    // Calculate total retaining walls cost
    const retainingWallsTotal = snapshot.retaining_walls_json ?
        Array.isArray(retainingWalls) ?
            retainingWalls.reduce((sum, wall) => sum + (wall.total_cost || 0), 0)
            : 0
        : 0;

    console.log("Retaining walls total:", retainingWallsTotal);

    // Calculate raw fencing total (without margin)
    const rawFencingTotal = (fencingData?.framelessGlassData?.total_cost || 0) +
        (fencingData?.flatTopMetalData?.total_cost || 0);

    // Get water features total from snapshot
    const waterFeaturesTotal = snapshot.water_feature_total_cost || 0;

    // Calculate subtotals for upgrades and extras
    const heatPumpRRP = snapshot.include_heat_pump ? (snapshot.heat_pump_rrp || 0) : 0;
    const heatPumpInstallation = snapshot.include_heat_pump ? (snapshot.heat_pump_installation_cost || 0) : 0;
    const heatPumpTotal = heatPumpRRP + heatPumpInstallation;

    const blanketRollerRRP = snapshot.include_blanket_roller ? (snapshot.blanket_roller_rrp || 0) : 0;
    const blanketRollerInstallation = snapshot.include_blanket_roller ? (snapshot.blanket_roller_installation_cost || 0) : 0;
    const blanketRollerTotal = blanketRollerRRP + blanketRollerInstallation;

    const cleanerTotal = snapshot.cleaner_included ? (snapshot.cleaner_unit_price || 0) : 0;

    // Use the total margin from the snapshot
    const upgradesExtrasMargin = snapshot.upgrades_extras_total
        ? Math.round((snapshot.upgrades_extras_total * 0.25)) // Assuming 25% margin, adjust if needed
        : 0;

    // Calculate subtotals by category
    const heatingTotal = heatPumpTotal + blanketRollerTotal;

    // Overall upgrades total - use the value from snapshot if available
    const upgradesExtrasTotal = snapshot.upgrades_extras_total || (heatingTotal + cleanerTotal);

    console.log(snapshot)

    return (
        <MarginVisibilityContext.Provider value={showMargins && !isCustomerView}>
            <div className="container mx-auto px-4 py-6 max-w-5xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-primary">Pool Project Price Summary</h2>
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
                                                <User className="h-4 w-4 text-primary" /> :
                                                <FileText className="h-4 w-4 text-primary" />
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
                <p className="text-slate-600 mb-6">Complete breakdown of all price components for this pool project</p>

                {/* GRAND TOTAL */}
                <Card className="mb-8 shadow-md border-primary/20">
                    <CardContent className="py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-primary">GRAND TOTAL</h3>
                                <p className="text-sm text-slate-500">Total Price Including All Components</p>
                            </div>
                            <div className="text-2xl font-bold text-primary">
                                {formatCurrency(basePriceTotal + siteRequirementsTotalWithMargin + concretePavingTotal + retainingWallsTotal + rawFencingTotal + (snapshot.elec_total_cost || 0) + waterFeaturesTotal + upgradesExtrasTotal)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* BASE PRICE SECTION */}
                <Card className="mb-6 shadow-sm">
                    <div
                        className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('basePrice')}
                    >
                        <div>
                            <h3 className="text-primary text-lg font-medium">Base Price</h3>
                            {!isCustomerView && (
                                <p className="text-sm text-slate-500">
                                    Margin: {marginPct}% ({formatCurrency(marginAmount)})
                                </p>
                            )}
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(basePriceTotal)}</span>
                            {expandedSections.basePrice ? (
                                <ChevronUp className="h-5 w-5 text-primary" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-primary" />
                            )}
                        </div>
                    </div>

                    {expandedSections.basePrice && (
                        <CardContent className="p-0">
                            <div className="p-0">
                                <table className="w-full">
                                    <tbody>
                                        <LineItem
                                            label="Pool Shell"
                                            code=""
                                            value={poolShellPrice}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(poolShellCost)}` : null}
                                        />
                                        <LineItem
                                            label="Excavation & Truck"
                                            code=""
                                            value={digPrice}
                                            breakdown={!isCustomerView ?
                                                `Cost: ${formatCurrency(digCost)} ($${snapshot.dig_excavation_rate || 0} × ${snapshot.dig_excavation_hours || 0} hrs + $${snapshot.dig_truck_rate || 0} × ${snapshot.dig_truck_hours || 0} hrs × ${snapshot.dig_truck_qty || 0} trucks)`
                                                : null}
                                        />
                                        <LineItem
                                            label="Filtration Package"
                                            code=""
                                            value={filtrationPrice}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(filtrationCost)}` : null}
                                        />
                                        <LineItem
                                            label="Individual Components"
                                            code=""
                                            value={individualCostsTotal}
                                            breakdown={!isCustomerView ? `Cost: ${formatCurrency(individualCosts)}` : null}
                                        />
                                        <LineItem
                                            label="Fixed Costs"
                                            code=""
                                            value={fixedCostsTotal}
                                        />

                                        {!isCustomerView && (
                                            <>
                                                <SubtotalRow
                                                    label="Base Price Before Margin"
                                                    value={basePriceBeforeMargin}
                                                />
                                                <MarginRow
                                                    percentage={marginPct}
                                                />
                                            </>
                                        )}

                                        <TotalRow
                                            label="Base Price Total"
                                            value={basePriceTotal}
                                        />
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* SITE REQUIREMENTS SECTION */}
                {siteRequirementsBeforeMargin > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('siteRequirements')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Site Requirements</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        Margin: {marginPct}% ({formatCurrency(siteRequirementsMarginAmount)})
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(siteRequirementsTotalWithMargin)}</span>
                                {expandedSections.siteRequirements ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.siteRequirements && (
                            <CardContent className="p-0">
                                <div className="p-0">
                                    <table className="w-full">
                                        <tbody>
                                            {adjustedCraneCost > 0 && (
                                                <LineItem
                                                    label={`Crane${craneData?.name ? `: ${craneData.name}` : ''}`}
                                                    code=""
                                                    value={cranePriceWithMargin}
                                                    breakdown={!isCustomerView ?
                                                        `Cost: ${formatCurrency(adjustedCraneCost)}`
                                                        : null}
                                                />
                                            )}
                                            {bobcatCost > 0 && (
                                                <LineItem
                                                    label={`Bobcat${bobcatData ? `: ${bobcatData?.size_category || ''} - ${bobcatData?.day_code || ''}` : ''}`}
                                                    code=""
                                                    value={bobcatPriceWithMargin}
                                                    breakdown={!isCustomerView ?
                                                        `Cost: ${formatCurrency(bobcatCost)}`
                                                        : null}
                                                />
                                            )}
                                            {trafficControlCost > 0 && (
                                                <LineItem
                                                    label={`Traffic Control${trafficControlData?.name ? `: ${trafficControlData?.name}` : ''}`}
                                                    code=""
                                                    value={trafficControlPriceWithMargin}
                                                    breakdown={!isCustomerView ?
                                                        `Cost: ${formatCurrency(trafficControlCost)}`
                                                        : null}
                                                />
                                            )}
                                            {customSiteRequirements.length > 0 && customSiteRequirements.map((item, index) => {
                                                const itemCost = typeof item.price === 'string' ?
                                                    parseFloat(item.price || '0') :
                                                    (typeof item.price === 'number' ? item.price : 0);

                                                const itemDescription = item.description ||
                                                    item.name ||
                                                    "Custom Requirement";

                                                const itemPriceWithMargin = calcTotal(itemCost, marginPct);

                                                return itemCost > 0 ? (
                                                    <LineItem
                                                        key={`custom-req-${index}`}
                                                        label={itemDescription}
                                                        code=""
                                                        value={itemPriceWithMargin}
                                                        breakdown={!isCustomerView ? `Cost: ${formatCurrency(itemCost)}` : null}
                                                    />
                                                ) : null;
                                            })}
                                            {additionalSiteRequirementsCost > 0 && (
                                                <LineItem
                                                    label="Additional Requirements"
                                                    code=""
                                                    value={additionalSiteRequirementsPriceWithMargin}
                                                    breakdown={!isCustomerView ? `Cost: ${formatCurrency(additionalSiteRequirementsCost)}` : null}
                                                />
                                            )}

                                            {!isCustomerView && (
                                                <>
                                                    <SubtotalRow
                                                        label="Site Requirements Before Margin"
                                                        value={siteRequirementsBeforeMargin}
                                                    />
                                                    <MarginRow
                                                        percentage={marginPct}
                                                    />
                                                </>
                                            )}

                                            <TotalRow
                                                label="Site Requirements Total"
                                                value={siteRequirementsTotalWithMargin}
                                            />
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* CONCRETE & PAVING SECTION */}
                {concretePavingTotal > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('concretePaving')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Concrete & Paving</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        (Margin Already Included)
                                        {concretePavingMarginData?.totalMargin > 0 &&
                                            ` (${formatCurrency(concretePavingMarginData.totalMargin)} margin)`}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(concretePavingTotal)}</span>
                                {expandedSections.concretePaving ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.concretePaving && (
                            <CardContent className="p-0">
                                <div className="p-0">
                                    <table className="w-full">
                                        <tbody>
                                            {concreteCutsCost > 0 && (
                                                <LineItem
                                                    label="Concrete Cuts"
                                                    code=""
                                                    value={concreteCutsCost}
                                                    breakdown={!isCustomerView && concreteCutsData && concreteCutsData.length > 0 ?
                                                        concreteCutsData.map(cut => cut.cut_type).join(', ') :
                                                        null}
                                                />
                                            )}
                                            {extraPavingCost > 0 && (
                                                <LineItem
                                                    label={`Extra Paving${pavingData?.extraPavingCategory ? `: ${pavingData.extraPavingCategory}` : ''}`}
                                                    code=""
                                                    value={extraPavingCost}
                                                    breakdown={null}
                                                />
                                            )}
                                            {existingPavingCost > 0 && (
                                                <LineItem
                                                    label={`Paving on Existing Concrete${pavingData?.existingPavingCategory ? `: ${pavingData.existingPavingCategory}` : ''}`}
                                                    code=""
                                                    value={existingPavingCost}
                                                    breakdown={null}
                                                />
                                            )}
                                            {extraConcretingCost > 0 && (
                                                <LineItem
                                                    label={`Extra Concreting${pavingData?.extraConcretingType ? `: ${pavingData.extraConcretingType}` : ''}`}
                                                    code=""
                                                    value={extraConcretingCost}
                                                    breakdown={null}
                                                />
                                            )}
                                            {concretePumpTotalCost > 0 && (
                                                <LineItem
                                                    label="Concrete Pump"
                                                    code=""
                                                    value={concretePumpTotalCost}
                                                    breakdown={!isCustomerView && concretePumpData?.concrete_pump_quantity ?
                                                        `${concretePumpData.concrete_pump_quantity} pump setup${concretePumpData.concrete_pump_quantity > 1 ? 's' : ''}` : null}
                                                />
                                            )}
                                            {ufStripsCost > 0 && (
                                                <LineItem
                                                    label="Under Fence Strips"
                                                    code=""
                                                    value={ufStripsCost}
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
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* RETAINING WALLS SECTION */}
                {retainingWallsTotal > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('retainingWalls')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Retaining Walls</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        (Margin Already Included)
                                        {retainingWallsMarginData?.totalMargin > 0 &&
                                            ` (${formatCurrency(retainingWallsMarginData.totalMargin)} margin)`}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(retainingWallsTotal)}</span>
                                {expandedSections.retainingWalls ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.retainingWalls && (
                            <CardContent className="p-0">
                                <div className="p-0">
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
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* FENCING SECTION */}
                {snapshot.fencing_total_cost > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('fencing')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Fencing</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        (Margin Already Included)
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(rawFencingTotal)}</span>
                                {expandedSections.fencing ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.fencing && (
                            <CardContent className="p-0">
                                <div className="p-0">
                                    <table className="w-full">
                                        <tbody>
                                            {/* Frameless Glass Fencing */}
                                            {fencingData?.framelessGlassData?.linear_meters > 0 && (
                                                <>
                                                    <tr className="border-b border-slate-100 font-medium">
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
                                                    <tr className="border-b border-slate-100 font-medium mt-2">
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
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* ELECTRICAL SECTION */}
                {snapshot.elec_total_cost > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('electrical')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Electrical</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        (Margin Already Included)
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(snapshot.elec_total_cost)}</span>
                                {expandedSections.electrical ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.electrical && (
                            <CardContent className="p-0">
                                <div className="p-0">
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
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* WATER FEATURES SECTION */}
                {waterFeaturesTotal > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('waterFeatures')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Water Features</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        (Margin Already Included)
                                        {` (${formatCurrency(1300)} margin)`}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(waterFeaturesTotal)}</span>
                                {expandedSections.waterFeatures ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.waterFeatures && (
                            <CardContent className="p-0">
                                <div className="p-0">
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
                                                <tr className="bg-slate-50 text-sm text-slate-500">
                                                    <td colSpan={3} className="p-2 text-center italic">
                                                        All prices include margin — no additional markup needed
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* UPGRADES & EXTRAS - GENERAL SECTION */}
                <Card className="mb-6 shadow-sm">
                    <div
                        className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                        onClick={() => toggleSection('upgradesExtrasGeneral')}
                    >
                        <div>
                            <h3 className="text-primary text-lg font-medium">Upgrades & Extras - General</h3>
                            {!isCustomerView && (
                                <p className="text-sm text-slate-500">
                                    (Margin Already Included)
                                </p>
                            )}
                        </div>
                        <div className="flex items-center">
                            <span className="mr-4 font-semibold">{formatCurrency(0)}</span>
                            {expandedSections.upgradesExtrasGeneral ? (
                                <ChevronUp className="h-5 w-5 text-primary" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-primary" />
                            )}
                        </div>
                    </div>

                    {expandedSections.upgradesExtrasGeneral && (
                        <CardContent className="p-0">
                            <div className="p-0">
                                <table className="w-full">
                                    <tbody>
                                        <tr className="border-b border-slate-100">
                                            <td className="p-2 text-center text-muted-foreground" colSpan={3}>
                                                No general upgrades or extras selected
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    )}
                </Card>

                {/* UPGRADES & EXTRAS - HEATING SECTION */}
                {heatingTotal > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('upgradesExtrasHeating')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Upgrades & Extras - Heating</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        (Margin Already Included)
                                        {upgradesExtrasMargin > 0 && ` (${formatCurrency(upgradesExtrasMargin)} margin)`}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(heatingTotal)}</span>
                                {expandedSections.upgradesExtrasHeating ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.upgradesExtrasHeating && (
                            <CardContent className="p-0">
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
                            </CardContent>
                        )}
                    </Card>
                )}

                {/* UPGRADES & EXTRAS - POOL CLEANER SECTION */}
                {cleanerTotal > 0 && (
                    <Card className="mb-6 shadow-sm">
                        <div
                            className="py-3 px-4 bg-white border-b border-slate-200 flex justify-between items-center cursor-pointer"
                            onClick={() => toggleSection('upgradesExtrasCleaner')}
                        >
                            <div>
                                <h3 className="text-primary text-lg font-medium">Upgrades & Extras - Pool Cleaner</h3>
                                {!isCustomerView && (
                                    <p className="text-sm text-slate-500">
                                        (Margin Already Included)
                                        {upgradesExtrasMargin > 0 && ` (${formatCurrency(upgradesExtrasMargin)} margin)`}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center">
                                <span className="mr-4 font-semibold">{formatCurrency(cleanerTotal)}</span>
                                {expandedSections.upgradesExtrasCleaner ? (
                                    <ChevronUp className="h-5 w-5 text-primary" />
                                ) : (
                                    <ChevronDown className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        </div>

                        {expandedSections.upgradesExtrasCleaner && (
                            <CardContent className="p-0">
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
                            </CardContent>
                        )}
                    </Card>
                )}

            </div>
        </MarginVisibilityContext.Provider>
    );
}; 