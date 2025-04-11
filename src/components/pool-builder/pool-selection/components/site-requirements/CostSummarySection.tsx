
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
  isDefaultCrane: boolean;
  defaultCraneCost: number;
  customRequirementsMargin?: number;
  craneMargin?: number;
  trafficControlMargin?: number;
  bobcatMargin?: number;
}

export const CostSummarySection: React.FC<CostSummarySectionProps> = ({
  craneCost,
  trafficControlCost,
  bobcatCost,
  customRequirementsTotal,
  totalCost,
  isDefaultCrane,
  defaultCraneCost,
  customRequirementsMargin = 0,
  craneMargin = 0,
  trafficControlMargin = 0,
  bobcatMargin = 0
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
          isDefaultCrane={isDefaultCrane}
          defaultCraneCost={defaultCraneCost}
          customRequirementsMargin={customRequirementsMargin}
          craneMargin={craneMargin}
          trafficControlMargin={trafficControlMargin}
          bobcatMargin={bobcatMargin}
        />
      </CardContent>
    </Card>
  );
};
