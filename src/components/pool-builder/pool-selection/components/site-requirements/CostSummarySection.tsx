
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { SiteRequirementsCostSummary } from "./SiteRequirementsCostSummary";
import { SiteRequirementsFormHeader } from "./SiteRequirementsFormHeader";

interface CostSummarySectionProps {
  craneCost: number;
  trafficControlCost: number;
  bobcatCost: number;
  customRequirementsTotal: number;
  totalCost: number;
}

export const CostSummarySection: React.FC<CostSummarySectionProps> = ({
  craneCost,
  trafficControlCost,
  bobcatCost,
  customRequirementsTotal,
  totalCost
}) => {
  return (
    <Card>
      <SiteRequirementsFormHeader 
        title="Site Requirements Cost Summary" 
        icon={<Calculator className="h-5 w-5 text-primary" />}
        className="bg-secondary/20"
      />
      <CardContent className="pt-4">
        <SiteRequirementsCostSummary 
          craneCost={craneCost} 
          trafficControlCost={trafficControlCost}
          bobcatCost={bobcatCost}
          customRequirementsTotal={customRequirementsTotal}
          totalCost={totalCost}
        />
      </CardContent>
    </Card>
  );
};
