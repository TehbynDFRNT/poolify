import { PoolRetainingWall } from "@/integrations/supabase/types";
import { Pool } from "@/types/pool";
import { Fence } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

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
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Fence className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Retaining Walls</h3>
                </div>
                <div className="text-lg font-semibold">
                    ${totalCost.toFixed(2)}
                </div>
            </div>

            <div className="border rounded-md p-4 space-y-4">
                {retainingWalls.walls.map((wall, index) => (
                    <div key={wall.id || index} className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Wall {index + 1}: {wall.wall_type}</span>
                            <span>${wall.total_cost?.toFixed(2) || '0.00'}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <div className="grid grid-cols-2 gap-2">
                                <div>Height 1: {wall.height1}m</div>
                                <div>Height 2: {wall.height2}m</div>
                                <div>Length: {wall.length}m</div>
                                <div>Area: {((Number(wall.height1) + Number(wall.height2)) / 2 * Number(wall.length)).toFixed(2)}m²</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}; 