import { Pool } from "@/types/pool";
import { Droplets } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface WaterFeatureSummaryProps {
    pool: Pool;
    customerId: string;
    waterFeatures?: any;
}

export const WaterFeatureSummary: React.FC<WaterFeatureSummaryProps> = ({
    pool,
    customerId,
    waterFeatures
}) => {
    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Water Features"
            sectionId="water-feature"
            data={waterFeatures}
            icon={<Droplets className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 