import { Pool } from "@/types/pool";
import { MapPin } from "lucide-react";
import React from "react";
import { PlaceholderSummary } from "./PlaceholderSummary";

interface SiteRequirementsSummaryProps {
    pool: Pool;
    customerId: string;
    siteRequirements?: any;
}

export const SiteRequirementsSummary: React.FC<SiteRequirementsSummaryProps> = ({
    pool,
    customerId,
    siteRequirements
}) => {
    return (
        <PlaceholderSummary
            pool={pool}
            customerId={customerId}
            title="Site Requirements"
            sectionId="site-requirements"
            data={siteRequirements}
            icon={<MapPin className="h-6 w-6 mx-auto mb-2" />}
        />
    );
}; 