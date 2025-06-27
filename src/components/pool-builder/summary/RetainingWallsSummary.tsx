import { PoolRetainingWall } from "@/integrations/supabase/types";
import { Pool } from "@/types/pool";
import { Fence } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";
import { EditSectionLink } from "./EditSectionLink";
import { formatCurrency } from "@/utils/format";

interface RetainingWallsSummaryProps {
    pool: Pool;
    customerId: string;
    retainingWalls?: {
        walls: PoolRetainingWall[];
    };
}

export const RetainingWallsSummary: React.FC<RetainingWallsSummaryProps> = ({
    pool,
    customerId,
    retainingWalls
}) => {
    // If there are no retaining walls, or the walls array is empty, display the placeholder
    if (!retainingWalls?.walls || retainingWalls.walls.length === 0) {
        return (
            <PlaceholderSummary
                pool={pool}
                customerId={customerId}
                title="Retaining Walls"
                sectionId="retaining-walls"
                data={null}
                icon={<Fence className="h-6 w-6 mx-auto mb-2" />}
            />
        );
    }

    // Calculate total cost from all walls
    const totalCost = retainingWalls.walls.reduce((sum, wall) => sum + (wall.total_cost || 0), 0);

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Retaining Walls</h3>
                <EditSectionLink section="retaining-walls" customerId={customerId} />
            </div>

            {/* Retaining Walls Details Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left py-2 font-medium">Wall</th>
                            <th className="text-left py-2 font-medium">Type</th>
                            <th className="text-right py-2 font-medium">Dimensions</th>
                            <th className="text-right py-2 font-medium">Area</th>
                            <th className="text-right py-2 font-medium">Total Cost</th>
                        </tr>
                    </thead>
                    <tbody>
                        {retainingWalls.walls.map((wall, index) => {
                            const area = ((Number(wall.height1) + Number(wall.height2)) / 2 * Number(wall.length));
                            return (
                                <tr key={wall.id || index} className="border-b">
                                    <td className="py-2">Wall {index + 1}</td>
                                    <td className="py-2">{wall.wall_type}</td>
                                    <td className="text-right py-2">
                                        {wall.height1}m × {wall.height2}m × {wall.length}m
                                    </td>
                                    <td className="text-right py-2">{area.toFixed(2)} m²</td>
                                    <td className="text-right py-2">{formatCurrency(wall.total_cost || 0)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr className="border-t-2">
                            <td colSpan={4} className="pt-3 font-semibold">Total Retaining Walls:</td>
                            <td className="text-right pt-3 font-semibold">{formatCurrency(totalCost)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}; 