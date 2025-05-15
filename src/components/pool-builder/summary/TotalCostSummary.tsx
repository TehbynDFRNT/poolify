import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { EditSectionLink } from "./EditSectionLink";

interface TotalCostSummaryProps {
    pool: Pool;
    customerId: string;
    projectData: any;
}

export const TotalCostSummary: React.FC<TotalCostSummaryProps> = ({
    pool,
    customerId,
    projectData
}) => {
    // Fetch margin data for this pool
    const { data: marginData } = useQuery({
        queryKey: ['pool-margin', pool.id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('pool_margins')
                .select('margin_percentage')
                .eq('pool_id', pool.id)
                .single();

            if (error && error.code !== 'PGRST116') {
                console.error('Error fetching margin data:', error);
                return null;
            }

            return data?.margin_percentage || 0;
        },
        enabled: !!pool.id,
    });

    // Calculate base pool cost
    const basePoolCost = pool.buy_price_inc_gst || 0;

    // Calculate additional costs from each section
    // These would be calculated based on data from each section
    const siteRequirementsCost = projectData?.site_requirements_total || 0;
    const concretePavingCost = projectData?.concrete_paving_total || 0;
    const retainingWallsCost = projectData?.retaining_walls_total || 0;
    const fencingCost = projectData?.fencing_total || 0;
    const electricalCost = projectData?.electrical_total || 0;
    const waterFeaturesCost = projectData?.water_features_total || 0;
    const upgradesExtrasCost = projectData?.upgrades_extras_total || 0;

    // Calculate heating costs if available
    const heatingCost = projectData?.heating_total_cost || 0;
    const heatingMargin = projectData?.heating_total_margin || 0;

    // Sum up all costs
    const totalCost =
        basePoolCost +
        siteRequirementsCost +
        concretePavingCost +
        retainingWallsCost +
        fencingCost +
        electricalCost +
        waterFeaturesCost +
        upgradesExtrasCost +
        heatingCost;

    // Calculate RRP using margin formula: Cost / (1 - Margin/100)
    const marginPercentage = marginData || 0;
    const calculateRRP = (cost: number, marginPercentage: number) => {
        if (marginPercentage >= 100) return 0; // Prevent division by zero or negative values
        return cost / (1 - marginPercentage / 100);
    };

    const rrp = calculateRRP(totalCost, marginPercentage);
    const dollarMargin = rrp - totalCost;

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Total Costs Summary</h3>
                <EditSectionLink section="formula-reference" customerId={customerId} />
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Base Pool Cost</p>
                        <p className="font-medium">{formatCurrency(basePoolCost)}</p>
                    </div>

                    {siteRequirementsCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Site Requirements</p>
                            <p className="font-medium">{formatCurrency(siteRequirementsCost)}</p>
                        </div>
                    )}

                    {concretePavingCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Concrete & Paving</p>
                            <p className="font-medium">{formatCurrency(concretePavingCost)}</p>
                        </div>
                    )}

                    {retainingWallsCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Retaining Walls</p>
                            <p className="font-medium">{formatCurrency(retainingWallsCost)}</p>
                        </div>
                    )}

                    {fencingCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Fencing</p>
                            <p className="font-medium">{formatCurrency(fencingCost)}</p>
                        </div>
                    )}

                    {electricalCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Electrical</p>
                            <p className="font-medium">{formatCurrency(electricalCost)}</p>
                        </div>
                    )}

                    {waterFeaturesCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Water Features</p>
                            <p className="font-medium">{formatCurrency(waterFeaturesCost)}</p>
                        </div>
                    )}

                    {upgradesExtrasCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Upgrades & Extras</p>
                            <p className="font-medium">{formatCurrency(upgradesExtrasCost)}</p>
                        </div>
                    )}

                    {heatingCost > 0 && (
                        <div>
                            <p className="text-sm text-muted-foreground">Heating Options</p>
                            <p className="font-medium">{formatCurrency(heatingCost)}</p>
                        </div>
                    )}
                </div>

                <Card className="bg-slate-50">
                    <CardContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Total Cost</p>
                                <p className="font-medium text-lg">{formatCurrency(totalCost)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Margin Percentage</p>
                                <p className="font-medium text-lg">{marginPercentage}%</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Dollar Margin</p>
                                <p className="font-medium text-lg">{formatCurrency(dollarMargin)}</p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Total Price (RRP)</p>
                                <p className="font-medium text-lg text-primary">{formatCurrency(rrp)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}; 