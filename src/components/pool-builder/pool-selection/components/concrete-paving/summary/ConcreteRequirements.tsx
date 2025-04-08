
import React from "react";
import { formatCurrency } from "@/utils/format";
import { SummaryData } from "@/hooks/useConcretePavingSummary";

interface ConcreteRequirementsProps {
  summaryData: SummaryData;
}

export const ConcreteRequirements: React.FC<ConcreteRequirementsProps> = ({ summaryData }) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-muted-foreground">Concrete Requirements</h4>
      <div className="space-y-1 text-sm">
        {summaryData.extraConcretingCost > 0 && (
          <div className="flex justify-between py-1">
            <span>Extra Concreting:</span>
            <span className="font-medium">{formatCurrency(summaryData.extraConcretingCost)}</span>
          </div>
        )}
        {summaryData.concretePumpCost > 0 && (
          <div className="flex justify-between py-1">
            <span>Concrete Pump:</span>
            <span className="font-medium">{formatCurrency(summaryData.concretePumpCost)}</span>
          </div>
        )}
        {summaryData.underFenceStripsCost > 0 && (
          <div className="flex justify-between py-1">
            <span>Under Fence Concrete Strips:</span>
            <span className="font-medium">{formatCurrency(summaryData.underFenceStripsCost)}</span>
          </div>
        )}
        {summaryData.concreteCutsCost > 0 && (
          <div className="flex justify-between py-1">
            <span>Concrete Cuts:</span>
            <span className="font-medium">{formatCurrency(summaryData.concreteCutsCost)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
