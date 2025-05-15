import { Pool } from "@/types/pool";
import { Fence } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface RetainingWallsSummaryProps {
    pool: Pool;
    customerId: string;
    retainingWalls?: any;
}

export const RetainingWallsSummary: React.FC<RetainingWallsSummaryProps> = ({
    pool,
    customerId,
    retainingWalls
}) => {
    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Retaining Walls"
            sectionId="retaining-walls"
            data={retainingWalls}
            icon={<Fence className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 