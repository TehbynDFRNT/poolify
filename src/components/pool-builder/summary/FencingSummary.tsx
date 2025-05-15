import { Pool } from "@/types/pool";
import { Fence } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface FencingSummaryProps {
    pool: Pool;
    customerId: string;
    fencing?: any;
}

export const FencingSummary: React.FC<FencingSummaryProps> = ({
    pool,
    customerId,
    fencing
}) => {
    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Fencing"
            sectionId="fencing"
            data={fencing}
            icon={<Fence className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 