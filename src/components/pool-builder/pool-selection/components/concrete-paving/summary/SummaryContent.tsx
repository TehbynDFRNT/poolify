
import React from "react";
import { PavingRequirements } from "./PavingRequirements";
import { ConcreteRequirements } from "./ConcreteRequirements";
import { SummaryData } from "@/hooks/useConcretePavingSummary";

interface SummaryContentProps {
  summaryData: SummaryData;
}

export const SummaryContent: React.FC<SummaryContentProps> = ({ summaryData }) => {
  // Check if there's any cost data
  const hasAnyCosts = summaryData.totalCost > 0;

  if (!hasAnyCosts) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No concrete or paving costs have been added yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <PavingRequirements summaryData={summaryData} />
        <ConcreteRequirements summaryData={summaryData} />
      </div>
    </div>
  );
};
