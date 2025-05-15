import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { EditSectionLink } from "./EditSectionLink";

interface PoolDetailsSummaryProps {
    pool: Pool;
    customerId?: string | null;
}

export const PoolDetailsSummary: React.FC<PoolDetailsSummaryProps> = ({ pool, customerId }) => {
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
                    <p className="font-medium">
                        {pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : "N/A"}
                    </p>
                </div>
            </div>
        </div>
    );
}; 