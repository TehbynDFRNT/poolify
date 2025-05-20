import { supabase } from "@/integrations/supabase/client";
import { useExcavation } from "@/pages/Quotes/components/SelectPoolStep/hooks/useExcavation";
import { useFiltrationPackage } from "@/pages/Quotes/components/SelectPoolStep/hooks/useFiltrationPackage";
import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";
import { useQuery } from "@tanstack/react-query";
import React, { useContext } from "react";
import { EditSectionLink } from "./EditSectionLink";
import { MarginVisibilityContext } from "./SummarySection";

interface PoolDetailsSummaryProps {
    pool: Pool;
    customerId?: string | null;
}

export const PoolDetailsSummary: React.FC<PoolDetailsSummaryProps> = ({ pool, customerId }) => {
    // Get margin visibility from context
    const showMargins = useContext(MarginVisibilityContext);

    // Fetch margin data
    const { marginData } = useMargin(pool.id);

    // Fetch pool type information
    const { data: poolType } = useQuery({
        queryKey: ['pool-type', pool.pool_type_id],
        queryFn: async () => {
            if (!pool.pool_type_id) return null;

            const { data, error } = await supabase
                .from('pool_types')
                .select('name')
                .eq('id', pool.pool_type_id)
                .single();

            if (error) {
                console.error('Error fetching pool type:', error);
                return null;
            }

            return data;
        },
        enabled: !!pool.pool_type_id,
    });
    console.log(customerId);
    // Fetch filtration package and excavation data
    const { filtrationPackage } = useFiltrationPackage(pool, customerId || undefined);
    const { excavationDetails } = useExcavation(pool.id);

    // Calculate filtration cost using consistent calculation method
    const filtrationCost = filtrationPackage ? calculatePackagePrice(filtrationPackage) : 0;

    // Get excavation cost
    const excavationCost = excavationDetails ? parseFloat(excavationDetails.price) : 0;

    // Set concrete cost - matching the approach in PoolDetailsSection
    const concreteCost = 0; // This is set to 0 in the pool selection tab as well

    // Calculate the total base cost
    const totalBasePoolCost = pool.buy_price_inc_gst + excavationCost + concreteCost + filtrationCost;

    // Calculate RRP using margin formula: Cost / (1 - Margin/100)
    const calculateRRP = (cost: number, marginPercentage: number) => {
        if (marginPercentage >= 100) return 0; // Prevent division by zero or negative values
        return cost / (1 - marginPercentage / 100);
    };

    // Helper to get color class for preview
    const getColorClass = (color: string) => {
        switch (color) {
            case "Silver Mist": return "bg-gray-300";
            case "Horizon": return "bg-gray-800";
            case "Twilight": return "bg-gray-700";
            default: return "bg-gray-300";
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Pool Details</h3>
                {customerId && <EditSectionLink section="pool-selection" customerId={customerId} />}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                    <p className="text-sm text-muted-foreground">Pool Name</p>
                    <p className="font-medium">{pool.name}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Pool Range</p>
                    <p className="font-medium">{pool.range || "N/A"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Pool Type</p>
                    <p className="font-medium">
                        {poolType ? poolType.name : (pool.pool_type_id ? "Loading..." : "Standard")}
                    </p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Dimensions</p>
                    <p className="font-medium">{pool.length}m × {pool.width}m</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Depth</p>
                    <p className="font-medium">{pool.depth_shallow}m - {pool.depth_deep}m</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Volume</p>
                    <p className="font-medium">{pool.volume_liters ? `${pool.volume_liters.toLocaleString()} liters` : "N/A"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Weight</p>
                    <p className="font-medium">{pool.weight_kg ? `${pool.weight_kg} kg` : "N/A"}</p>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Color</p>
                    <div className="flex items-center gap-2 mt-1">
                        {pool.color && (
                            <div className={`h-4 w-4 rounded-full ${getColorClass(pool.color)}`}></div>
                        )}
                        <p className="font-medium">{pool.color || "Default"}</p>
                    </div>
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Base Price</p>
                    {showMargins ? (
                        <p className="font-medium">
                            {formatCurrency(pool.buy_price_inc_gst)} <span className="text-primary">({formatCurrency(calculateRRP(pool.buy_price_inc_gst, marginData || 0))})</span>
                        </p>
                    ) : (
                        <p className="font-medium text-primary">
                            {formatCurrency(calculateRRP(pool.buy_price_inc_gst, marginData || 0))}
                        </p>
                    )}
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Excavation Cost</p>
                    {showMargins ? (
                        <p className="font-medium">
                            {formatCurrency(excavationCost)} <span className="text-primary">({formatCurrency(calculateRRP(excavationCost, marginData || 0))})</span>
                        </p>
                    ) : (
                        <p className="font-medium text-primary">
                            {formatCurrency(calculateRRP(excavationCost, marginData || 0))}
                        </p>
                    )}
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Concrete Cost</p>
                    {showMargins ? (
                        <p className="font-medium">
                            {formatCurrency(concreteCost)} <span className="text-primary">({formatCurrency(calculateRRP(concreteCost, marginData || 0))})</span>
                        </p>
                    ) : (
                        <p className="font-medium text-primary">
                            {formatCurrency(calculateRRP(concreteCost, marginData || 0))}
                        </p>
                    )}
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Filtration Cost</p>
                    {showMargins ? (
                        <p className="font-medium">
                            {formatCurrency(filtrationCost)} <span className="text-primary">({formatCurrency(calculateRRP(filtrationCost, marginData || 0))})</span>
                        </p>
                    ) : (
                        <p className="font-medium text-primary">
                            {formatCurrency(calculateRRP(filtrationCost, marginData || 0))}
                        </p>
                    )}
                </div>

                <div>
                    <p className="text-sm text-muted-foreground">Total Base Cost</p>
                    {showMargins ? (
                        <p className="font-medium">
                            {formatCurrency(totalBasePoolCost)} <span className="text-primary">({formatCurrency(calculateRRP(totalBasePoolCost, marginData || 0))})</span>
                        </p>
                    ) : (
                        <p className="font-medium text-primary">
                            {formatCurrency(calculateRRP(totalBasePoolCost, marginData || 0))}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}; 