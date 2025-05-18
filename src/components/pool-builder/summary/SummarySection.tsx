import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { supabase } from '@/integrations/supabase/client';
import { Pool } from '@/types/pool';
import { formatCurrency } from '@/utils/format';
import { validateUuid } from '@/utils/validators';
import { useQuery } from '@tanstack/react-query';
import { FileText, Loader2, User } from 'lucide-react';
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
    pump_price_inc_gst: number;
    filter_price_inc_gst: number;
    sanitiser_price_inc_gst: number;
    light_price_inc_gst: number;
    handover_components: string;
    concrete_cuts_cost: number;
    concrete_cuts_json: string;
    extra_paving_cost: number;
    existing_paving_cost: number;
    extra_concreting_saved_total: number;
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

    // Show no data state if no snapshot data
    if (!snapshot) {
        return (
            <div className="p-4 text-center space-y-4">
                <h2 className="text-xl font-semibold text-muted-foreground">
                    Project data not found
                </h2>
                <p className="text-muted-foreground">
                    Please create a new project or select an existing one.
                </p>
            </div>
        );
    }

    // Get margin percentage from the snapshot
    const marginPct = snapshot.pool_margin_pct || 0;

    // Helper for margin calculations
    const calcMargin = (cost, pct) => cost * (pct / 100);
    const calcTotal = (cost, pct) => cost / (1 - (pct / 100));

    // Parse JSON data first
    const fixedCosts = snapshot.fixed_costs_json ?
        (typeof snapshot.fixed_costs_json === 'string' ? JSON.parse(snapshot.fixed_costs_json) : snapshot.fixed_costs_json) : [];
    const retainingWalls = snapshot.retaining_walls_json ?
        (typeof snapshot.retaining_walls_json === 'string' ? JSON.parse(snapshot.retaining_walls_json) : snapshot.retaining_walls_json) : [];
    const handoverComponents = snapshot.handover_components ?
        (typeof snapshot.handover_components === 'string' ? JSON.parse(snapshot.handover_components) : snapshot.handover_components) : [];
    const concreteCuts = snapshot.concrete_cuts_json ?
        (typeof snapshot.concrete_cuts_json === 'string' ? JSON.parse(snapshot.concrete_cuts_json) : snapshot.concrete_cuts_json) : [];
    const siteRequirementsData = snapshot.site_requirements_data ?
        (typeof snapshot.site_requirements_data === 'string' ? JSON.parse(snapshot.site_requirements_data) : snapshot.site_requirements_data) : [];

    // Calculate site requirements total from items
    const siteRequirementsTotal = Array.isArray(siteRequirementsData) ?
        siteRequirementsData.reduce((sum, item) => sum + (item.price || 0), 0) :
        (snapshot.site_requirements_total || 0);

    // Calculate section totals first
    const basePoolPriceTotal = calcTotal((snapshot.spec_buy_inc_gst || 0) +
        (fixedCosts.reduce((sum, cost) => sum + (cost.price || 0), 0)) +
        (snapshot.pc_beam || 0) +
        (snapshot.pc_coping_supply || 0) +
        (snapshot.pc_coping_lay || 0) +
        (snapshot.pc_salt_bags || 0) +
        (snapshot.pc_trucked_water || 0) +
        (snapshot.pc_misc || 0) +
        (snapshot.pc_pea_gravel || 0) +
        (snapshot.pc_install_fee || 0),
        marginPct);

    const installationTotal = calcTotal((snapshot.crane_cost || 0) +
        (snapshot.bobcat_cost || 0) +
        ((snapshot.dig_excavation_rate || 0) * (snapshot.dig_excavation_hours || 0)) +
        ((snapshot.dig_truck_rate || 0) * (snapshot.dig_truck_hours || 0) * (snapshot.dig_truck_qty || 0)) +
        (snapshot.traffic_control_cost || 0) +
        siteRequirementsTotal, marginPct) +
        (snapshot.elec_total_cost || 0);

    const filtrationTotal = calcTotal((snapshot.pump_price_inc_gst || 0) +
        (snapshot.filter_price_inc_gst || 0) +
        (snapshot.sanitiser_price_inc_gst || 0) +
        (snapshot.light_price_inc_gst || 0) +
        handoverComponents.reduce((sum, comp) =>
            sum + ((comp.hk_component_price_inc_gst || 0) * (comp.hk_component_quantity || 0)), 0),
        marginPct);

    const concretePavingTotal = (snapshot.concrete_cuts_cost || 0) +
        (snapshot.extra_paving_cost || 0) +
        (snapshot.existing_paving_cost || 0) +
        (snapshot.extra_concreting_saved_total || 0) +
        (snapshot.concrete_pump_total_cost || 0) +
        (snapshot.uf_strips_cost || 0);

    const fencingTotal = snapshot.fencing_total_cost || 0;

    const waterFeatureTotal = snapshot.water_feature_total_cost || 0;

    const retainingWallsTotal = retainingWalls.reduce((sum, wall) => sum + (wall.total_cost || 0), 0);

    const extrasTotal = (snapshot.cleaner_included ? (snapshot.cleaner_unit_price || 0) : 0) +
        (snapshot.include_heat_pump ? (snapshot.heat_pump_cost || 0) : 0) +
        (snapshot.include_blanket_roller ? (snapshot.blanket_roller_cost || 0) : 0);

    // Calculate grand total by summing all section totals
    const grandTotal = basePoolPriceTotal +
        installationTotal +
        filtrationTotal +
        concretePavingTotal +
        fencingTotal +
        waterFeatureTotal +
        retainingWallsTotal +
        extrasTotal;

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
                                {formatCurrency(grandTotal)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* BASE POOL PRICE COMPONENTS */}
                <SectionCard title="Base Pool Price Components">
                    <LineItem
                        label="Pool Shell Cost"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.spec_buy_inc_gst || 0, marginPct) : (snapshot.spec_buy_inc_gst || 0)}
                    />

                    {fixedCosts.map((cost, idx) => (
                        <LineItem
                            key={idx}
                            label={cost.name}
                            code=""
                            value={cost.price || 0}
                        />
                    ))}

                    <LineItem
                        label="Beam"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_beam || 0, marginPct) : (snapshot.pc_beam || 0)}
                    />

                    <LineItem
                        label="Coping Supply"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_coping_supply || 0, marginPct) : (snapshot.pc_coping_supply || 0)}
                    />

                    <LineItem
                        label="Coping Lay"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_coping_lay || 0, marginPct) : (snapshot.pc_coping_lay || 0)}
                    />

                    <LineItem
                        label="Salt Bags"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_salt_bags || 0, marginPct) : (snapshot.pc_salt_bags || 0)}
                    />

                    <LineItem
                        label="Trucked Water"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_trucked_water || 0, marginPct) : (snapshot.pc_trucked_water || 0)}
                    />

                    <LineItem
                        label="Miscellaneous"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_misc || 0, marginPct) : (snapshot.pc_misc || 0)}
                    />

                    <LineItem
                        label="Pea Gravel"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_pea_gravel || 0, marginPct) : (snapshot.pc_pea_gravel || 0)}
                    />

                    <LineItem
                        label="Install Fee"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pc_install_fee || 0, marginPct) : (snapshot.pc_install_fee || 0)}
                    />

                    {/* Pool base cost subtotal */}
                    {!isCustomerView && (
                        <SubtotalRow
                            label="Base Cost (Before Margin)"
                            value={(snapshot.spec_buy_inc_gst || 0) +
                                (fixedCosts.reduce((sum, cost) => sum + (cost.price || 0), 0)) +
                                (snapshot.pc_beam || 0) +
                                (snapshot.pc_coping_supply || 0) +
                                (snapshot.pc_coping_lay || 0) +
                                (snapshot.pc_salt_bags || 0) +
                                (snapshot.pc_trucked_water || 0) +
                                (snapshot.pc_misc || 0) +
                                (snapshot.pc_pea_gravel || 0) +
                                (snapshot.pc_install_fee || 0)}
                        />
                    )}

                    {/* Margin row */}
                    {!isCustomerView && (
                        <MarginRow percentage={marginPct} formula="Formula: Cost ÷ (1 - margin %)" />
                    )}

                    {/* Total with margin */}
                    <TotalRow
                        label={isCustomerView ? "Base Pool Price" : "Base Pool Price (After Margin)"}
                        value={basePoolPriceTotal}
                    />
                </SectionCard>

                {/* INSTALLATION COSTS */}
                <SectionCard title="Installation Costs">
                    <LineItem
                        label="Crane Cost"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.crane_cost || 0, marginPct) : (snapshot.crane_cost || 0)}
                    />

                    <LineItem
                        label="Bobcat Cost"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.bobcat_cost || 0, marginPct) : (snapshot.bobcat_cost || 0)}
                    />

                    <LineItem
                        label="Excavation"
                        code=""
                        value={isCustomerView
                            ? calcTotal((snapshot.dig_excavation_rate || 0) * (snapshot.dig_excavation_hours || 0), marginPct)
                            : ((snapshot.dig_excavation_rate || 0) * (snapshot.dig_excavation_hours || 0))}
                        breakdown={!isCustomerView ? `$${snapshot.dig_excavation_rate || 0} × ${snapshot.dig_excavation_hours || 0} hours` : null}
                    />

                    <LineItem
                        label="Truck"
                        code=""
                        value={isCustomerView
                            ? calcTotal((snapshot.dig_truck_rate || 0) * (snapshot.dig_truck_hours || 0) * (snapshot.dig_truck_qty || 0), marginPct)
                            : ((snapshot.dig_truck_rate || 0) * (snapshot.dig_truck_hours || 0) * (snapshot.dig_truck_qty || 0))}
                        breakdown={!isCustomerView ? `$${snapshot.dig_truck_rate || 0} × ${snapshot.dig_truck_hours || 0} hours × ${snapshot.dig_truck_qty || 0} trucks` : null}
                    />

                    <LineItem
                        label="Traffic Control"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.traffic_control_cost || 0, marginPct) : (snapshot.traffic_control_cost || 0)}
                    />

                    <LineItem
                        label="Custom Site Requirements"
                        code=""
                        value={isCustomerView ? calcTotal(siteRequirementsTotal, marginPct) : siteRequirementsTotal}
                    />

                    <LineItem
                        label="Electrical"
                        code=""
                        value={snapshot.elec_total_cost || 0}
                        breakdown={!isCustomerView && snapshot.elec_standard_power_flag ? "Has Built-in Margin" : null}
                    />

                    {/* Site prep subtotal (excluding electrical) */}
                    {!isCustomerView && (
                        <SubtotalRow
                            label="Site Prep Costs (Before Margin, Excl. Electrical)"
                            value={(snapshot.crane_cost || 0) +
                                (snapshot.bobcat_cost || 0) +
                                ((snapshot.dig_excavation_rate || 0) * (snapshot.dig_excavation_hours || 0)) +
                                ((snapshot.dig_truck_rate || 0) * (snapshot.dig_truck_hours || 0) * (snapshot.dig_truck_qty || 0)) +
                                (snapshot.traffic_control_cost || 0) +
                                siteRequirementsTotal}
                        />
                    )}

                    {/* Margin row */}
                    {!isCustomerView && (
                        <MarginRow percentage={marginPct} formula="Formula: Cost ÷ (1 - margin %)" />
                    )}

                    {/* Total with margin including electrical */}
                    <TotalRow
                        label={isCustomerView ? "Installation Total" : "Installation Total (After Margin, Incl. Electrical)"}
                        value={installationTotal}
                    />
                </SectionCard>

                {/* FILTRATION & EQUIPMENT */}
                <SectionCard title="Filtration & Equipment">
                    <LineItem
                        label="Pump"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.pump_price_inc_gst || 0, marginPct) : (snapshot.pump_price_inc_gst || 0)}
                    />

                    <LineItem
                        label="Filter"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.filter_price_inc_gst || 0, marginPct) : (snapshot.filter_price_inc_gst || 0)}
                    />

                    <LineItem
                        label="Sanitiser"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.sanitiser_price_inc_gst || 0, marginPct) : (snapshot.sanitiser_price_inc_gst || 0)}
                    />

                    <LineItem
                        label="Light"
                        code=""
                        value={isCustomerView ? calcTotal(snapshot.light_price_inc_gst || 0, marginPct) : (snapshot.light_price_inc_gst || 0)}
                    />

                    {/* Calculate handover components value with or without margin */}
                    {isCustomerView ? (
                        <LineItem
                            label="Handover Kit Components"
                            code=""
                            value={calcTotal(handoverComponents.reduce((sum, comp) =>
                                sum + ((comp.hk_component_price_inc_gst || 0) * (comp.hk_component_quantity || 0)), 0), marginPct)}
                        />
                    ) : (
                        <LineItem
                            label="Handover Kit Components"
                            code=""
                            value={handoverComponents.reduce((sum, comp) =>
                                sum + ((comp.hk_component_price_inc_gst || 0) * (comp.hk_component_quantity || 0)), 0)}
                            breakdown={<HandoverKitItems components={handoverComponents} />}
                        />
                    )}

                    {/* Filtration base cost subtotal */}
                    {!isCustomerView && (
                        <SubtotalRow
                            label="Filtration Base Cost (Before Margin)"
                            value={(snapshot.pump_price_inc_gst || 0) +
                                (snapshot.filter_price_inc_gst || 0) +
                                (snapshot.sanitiser_price_inc_gst || 0) +
                                (snapshot.light_price_inc_gst || 0) +
                                handoverComponents.reduce((sum, comp) =>
                                    sum + ((comp.hk_component_price_inc_gst || 0) * (comp.hk_component_quantity || 0)), 0)}
                        />
                    )}

                    {/* Margin row */}
                    {!isCustomerView && (
                        <MarginRow percentage={marginPct} formula="Formula: Cost ÷ (1 - margin %)" />
                    )}

                    {/* Total with margin */}
                    <TotalRow
                        label={isCustomerView ? "Filtration Total" : "Filtration Total (After Margin)"}
                        value={filtrationTotal}
                    />
                </SectionCard>

                {/* CONCRETE & PAVING */}
                <SectionCard title={isCustomerView ? "Concrete & Paving" : "Concrete & Paving (Margin Included)"}>
                    <LineItem
                        label="Concrete Cuts"
                        code=""
                        value={snapshot.concrete_cuts_cost || 0}
                    />

                    <LineItem
                        label="Extra Paving"
                        code=""
                        value={snapshot.extra_paving_cost || 0}
                    />

                    <LineItem
                        label="Existing Paving"
                        code=""
                        value={snapshot.existing_paving_cost || 0}
                    />

                    <LineItem
                        label="Extra Concreting"
                        code=""
                        value={snapshot.extra_concreting_saved_total || 0}
                    />

                    <LineItem
                        label="Concrete Pump"
                        code=""
                        value={snapshot.concrete_pump_total_cost || 0}
                    />

                    <LineItem
                        label="UF Strips"
                        code=""
                        value={snapshot.uf_strips_cost || 0}
                    />

                    {/* Total included margin */}
                    <TotalRow
                        label="Concrete & Paving Total (Margin Included)"
                        value={concretePavingTotal}
                    />
                </SectionCard>

                {/* FENCING */}
                <SectionCard title={isCustomerView ? "Fencing" : "Fencing (Margin Included)"}>
                    <LineItem
                        label="Fencing Total"
                        code=""
                        value={fencingTotal}
                    />

                    {/* Total included margin */}
                    <TotalRow
                        label={isCustomerView ? "Fencing Total" : "Fencing Total (Margin Included)"}
                        value={fencingTotal}
                    />
                </SectionCard>

                {/* WATER FEATURE */}
                <SectionCard title={isCustomerView ? "Water Feature" : "Water Feature (Margin Included)"}>
                    <LineItem
                        label="Water Feature Total"
                        code=""
                        value={waterFeatureTotal}
                    />

                    {/* Total included margin */}
                    <TotalRow
                        label={isCustomerView ? "Water Feature Total" : "Water Feature Total (Margin Included)"}
                        value={waterFeatureTotal}
                    />
                </SectionCard>

                {/* RETAINING WALLS */}
                <SectionCard title={isCustomerView ? "Retaining Walls" : "Retaining Walls (Margin Included)"}>
                    {retainingWalls.map((wall, idx) => (
                        <LineItem
                            key={idx}
                            label={`Retaining Wall ${idx + 1}`}
                            code=""
                            value={wall.total_cost || 0}
                        />
                    ))}

                    {/* Total included margin */}
                    <TotalRow
                        label={isCustomerView ? "Retaining Walls Total" : "Retaining Walls Total (Margin Included)"}
                        value={retainingWallsTotal}
                    />
                </SectionCard>

                {/* EXTRAS & ADD-ONS */}
                <SectionCard title={isCustomerView ? "Extras & Add-ons" : "Extras & Add-ons (Margin Included)"}>
                    {snapshot.cleaner_included && (
                        <LineItem
                            label="Cleaner"
                            code=""
                            value={snapshot.cleaner_unit_price || 0}
                            breakdown={!isCustomerView ? `Included: $${snapshot.cleaner_cost_price || 0} + $${(snapshot.cleaner_unit_price || 0) - (snapshot.cleaner_cost_price || 0)} margin` : null}
                        />
                    )}

                    {snapshot.include_heat_pump && (
                        <LineItem
                            label="Heat Pump"
                            code=""
                            value={snapshot.heat_pump_cost || 0}
                            breakdown={!isCustomerView ? `Included at $${snapshot.heat_pump_cost || 0}` : null}
                        />
                    )}

                    {snapshot.include_blanket_roller && (
                        <LineItem
                            label="Blanket & Roller"
                            code=""
                            value={snapshot.blanket_roller_cost || 0}
                            breakdown={!isCustomerView ? `Included at $${snapshot.blanket_roller_cost || 0}` : null}
                        />
                    )}

                    {/* Total included margin */}
                    <TotalRow
                        label={isCustomerView ? "Extras Total" : "Extras Total (Margin Included)"}
                        value={extrasTotal}
                    />
                </SectionCard>

                {/* JSON SNAPSHOT DATA (Collapsed) - Only show in Default view */}
                {!isCustomerView && (
                    <div className="mt-8">
                        <details>
                            <summary className="cursor-pointer text-primary font-semibold">
                                View Technical Data
                            </summary>
                            <pre className="bg-slate-100 p-4 mt-2 text-xs overflow-auto max-h-96 rounded-md">
                                {JSON.stringify(snapshot, null, 2)}
                            </pre>
                        </details>
                    </div>
                )}
            </div>
        </MarginVisibilityContext.Provider>
    );
}; 