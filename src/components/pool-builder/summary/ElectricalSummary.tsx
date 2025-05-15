import { Pool } from "@/types/pool";
import { Zap } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface ElectricalSummaryProps {
    pool: Pool;
    customerId: string;
    electrical?: any;
}

export const ElectricalSummary: React.FC<ElectricalSummaryProps> = ({
    pool,
    customerId,
    electrical
}) => {
    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Electrical"
            sectionId="electrical"
            data={electrical}
            icon={<Zap className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 