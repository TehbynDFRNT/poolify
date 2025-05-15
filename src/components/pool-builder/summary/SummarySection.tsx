import { ConcreteAndPavingSummary } from "@/components/pool-builder/summary/ConcreteAndPavingSummary";
import { CustomerSummary } from "@/components/pool-builder/summary/CustomerSummary";
import { ElectricalSummary } from "@/components/pool-builder/summary/ElectricalSummary";
import { FencingSummary } from "@/components/pool-builder/summary/FencingSummary";
import { PoolDetailsSummary } from "@/components/pool-builder/summary/PoolDetailsSummary";
import { RetainingWallsSummary } from "@/components/pool-builder/summary/RetainingWallsSummary";
import { SiteRequirementsSummary } from "@/components/pool-builder/summary/SiteRequirementsSummary";
import { TotalCostSummary } from "@/components/pool-builder/summary/TotalCostSummary";
import { UpgradesAndExtrasSummary } from "@/components/pool-builder/summary/UpgradesAndExtrasSummary";
import { WaterFeatureSummary } from "@/components/pool-builder/summary/WaterFeatureSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { Pool, PoolProject } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

interface SummarySectionProps {
    pool: Pool | null;
    customer: PoolProject | null;
    customerId: string | null;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
    pool,
    customer,
    customerId
}) => {
    // Get project data from the pool_projects table
    const { data: projectData, isLoading } = useQuery({
        queryKey: ['project-summary', customerId],
        queryFn: async () => {
            if (!customerId) return null;

            const { data, error } = await supabase
                .from('pool_projects')
                .select('*')
                .eq('id', customerId)
                .single();

            if (error) {
                console.error('Error fetching project summary data:', error);
                return null;
            }

            // Fetch additional data for water features if needed
            let waterFeatures = null;
            try {
                const { data: waterFeatureData, error: waterFeatureError } = await supabase
                    .from('pool_water_features')
                    .select('*')
                    .eq('customer_id', customerId)
                    .maybeSingle();

                if (!waterFeatureError && waterFeatureData) {
                    waterFeatures = waterFeatureData;
                }
            } catch (err) {
                console.error('Error fetching water features:', err);
            }

            // Fetch frameless glass fencing data if available
            let fencing = null;
            try {
                const { data: fencingData, error: fencingError } = await supabase
                    .from('frameless_glass_fencing')
                    .select('*')
                    .eq('customer_id', customerId)
                    .maybeSingle();

                if (!fencingError && fencingData) {
                    fencing = fencingData;
                }
            } catch (err) {
                console.error('Error fetching fencing data:', err);
            }

            // Type the data as any to avoid TypeScript errors
            const projectData = data as any;

            // Return combined data
            return {
                ...projectData,
                water_features: waterFeatures,
                fencing: fencing,
                // Group data by section for easier consumption in child components
                site_requirements: {
                    crane_id: projectData.crane_id,
                    traffic_control_id: projectData.traffic_control_id,
                    bobcat_id: projectData.bobcat_id,
                    site_requirements_notes: projectData.site_requirements_notes,
                    site_requirements_data: projectData.site_requirements_data
                },
                concrete_paving: {
                    extra_paving_category: projectData.extra_paving_category,
                    extra_paving_square_meters: projectData.extra_paving_square_meters,
                    extra_paving_total_cost: projectData.extra_paving_total_cost,
                    existing_concrete_paving_category: projectData.existing_concrete_paving_category,
                    existing_concrete_paving_square_meters: projectData.existing_concrete_paving_square_meters,
                    existing_concrete_paving_total_cost: projectData.existing_concrete_paving_total_cost,
                    extra_concreting_type: projectData.extra_concreting_type,
                    extra_concreting_total_cost: projectData.extra_concreting_total_cost,
                    concrete_pump_needed: projectData.concrete_pump_needed,
                    concrete_pump_quantity: projectData.concrete_pump_quantity,
                    concrete_pump_total_cost: projectData.concrete_pump_total_cost,
                    under_fence_concrete_strips_data: projectData.under_fence_concrete_strips_data,
                    under_fence_concrete_strips_cost: projectData.under_fence_concrete_strips_cost,
                    concrete_cuts: projectData.concrete_cuts,
                    concrete_cuts_cost: projectData.concrete_cuts_cost
                },
                retaining_walls: {
                    retaining_wall1_type: projectData.retaining_wall1_type,
                    retaining_wall1_length: projectData.retaining_wall1_length,
                    retaining_wall1_height1: projectData.retaining_wall1_height1,
                    retaining_wall1_height2: projectData.retaining_wall1_height2,
                    retaining_wall1_total_cost: projectData.retaining_wall1_total_cost,
                    retaining_wall2_type: projectData.retaining_wall2_type,
                    retaining_wall2_length: projectData.retaining_wall2_length,
                    retaining_wall2_height1: projectData.retaining_wall2_height1,
                    retaining_wall2_height2: projectData.retaining_wall2_height2,
                    retaining_wall2_total_cost: projectData.retaining_wall2_total_cost
                },
                heating: {
                    include_heat_pump: projectData.include_heat_pump,
                    include_blanket_roller: projectData.include_blanket_roller,
                    heat_pump_id: projectData.heat_pump_id,
                    blanket_roller_id: projectData.blanket_roller_id,
                    heat_pump_cost: projectData.heat_pump_cost,
                    blanket_roller_cost: projectData.blanket_roller_cost,
                    heating_total_cost: projectData.heating_total_cost,
                    heating_total_margin: projectData.heating_total_margin
                },
                // Calculate section totals for the cost summary
                site_requirements_total: 0, // We don't have these costs directly in the data yet
                concrete_paving_total:
                    (projectData.extra_paving_total_cost || 0) +
                    (projectData.existing_concrete_paving_total_cost || 0) +
                    (projectData.extra_concreting_total_cost || 0) +
                    (projectData.concrete_pump_total_cost || 0) +
                    (projectData.under_fence_concrete_strips_cost || 0) +
                    (projectData.concrete_cuts_cost || 0),
                retaining_walls_total:
                    (projectData.retaining_wall1_total_cost || 0) +
                    (projectData.retaining_wall2_total_cost || 0),
                water_features_total:
                    (projectData.water_feature_total_cost || 0),
                fencing_total:
                    (fencing?.total_cost || 0),
                heating_total:
                    (projectData.heating_total_cost || 0)
            };
        },
        enabled: !!customerId,
    });

    if (!customerId || !pool) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">Please select a pool and save customer information first</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin mr-2" />
                <p>Loading project summary...</p>
            </div>
        );
    }

    // Since we know customerId is not null at this point, we can safely cast it to string
    const customerIdString = customerId as string;

    return (
        <div className="space-y-8 print:space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Project Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <CustomerSummary customer={customer} customerId={customerIdString} />

                        <Separator />

                        <PoolDetailsSummary pool={pool} customerId={customerIdString} />

                        <Separator />

                        <SiteRequirementsSummary
                            pool={pool}
                            customerId={customerIdString}
                            siteRequirements={projectData?.site_requirements}
                        />

                        <Separator />

                        <ConcreteAndPavingSummary
                            pool={pool}
                            customerId={customerIdString}
                            concretePaving={projectData?.concrete_paving}
                        />

                        <Separator />

                        <RetainingWallsSummary
                            pool={pool}
                            customerId={customerIdString}
                            retainingWalls={projectData?.retaining_walls}
                        />

                        <Separator />

                        <FencingSummary
                            pool={pool}
                            customerId={customerIdString}
                            fencing={projectData?.fencing}
                        />

                        <Separator />

                        <ElectricalSummary
                            pool={pool}
                            customerId={customerIdString}
                            electrical={{}} // We'll need to search for the correct electrical fields
                        />

                        <Separator />

                        <WaterFeatureSummary
                            pool={pool}
                            customerId={customerIdString}
                            waterFeatures={projectData?.water_features}
                        />

                        <Separator />

                        <UpgradesAndExtrasSummary
                            pool={pool}
                            customerId={customerIdString}
                            upgradesExtras={{}} // We'll need to search for the correct fields
                        />

                        <Separator />

                        <TotalCostSummary
                            pool={pool}
                            customerId={customerIdString}
                            projectData={projectData}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}; 