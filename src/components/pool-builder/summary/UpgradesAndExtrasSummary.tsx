import { Pool } from "@/types/pool";
import { Package } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface UpgradesAndExtrasSummaryProps {
    pool: Pool;
    customerId: string;
    upgradesExtras?: any;
}

export const UpgradesAndExtrasSummary: React.FC<UpgradesAndExtrasSummaryProps> = ({
    pool,
    customerId,
    upgradesExtras
}) => {
    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Upgrades & Extras"
            sectionId="upgrades-extras"
            data={upgradesExtras}
            icon={<Package className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 