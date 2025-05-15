import { Pool } from "@/types/pool";
import { Layers } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface ConcreteAndPavingSummaryProps {
    pool: Pool;
    customerId: string;
    concretePaving?: any;
}

export const ConcreteAndPavingSummary: React.FC<ConcreteAndPavingSummaryProps> = ({
    pool,
    customerId,
    concretePaving
}) => {
    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Concrete & Paving"
            sectionId="concrete-paving"
            data={concretePaving}
            icon={<Layers className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 