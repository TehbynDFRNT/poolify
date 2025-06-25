
import React from "react";
import { formatCurrency } from "@/utils/format";
import { SummaryData } from "@/hooks/useConcretePavingSummary";

interface PavingRequirementsProps {
  summaryData: SummaryData;
}

export const PavingRequirements: React.FC<PavingRequirementsProps> = ({ summaryData }) => {
  return (
    <div className="space-y-2">
      <h4 className="font-medium text-sm text-muted-foreground">Paving Requirements</h4>
      <div className="space-y-1 text-sm">
        {summaryData.extraPavingCost > 0 && (
          <div className="flex justify-between py-1">
            <span>Extra Paving:</span>
            <span className="font-medium">{formatCurrency(summaryData.extraPavingCost)}</span>
          </div>
        )}
        {summaryData.existingConcretePavingCost > 0 && (
          <div className="flex justify-between py-1">
            <span>Paving on Existing Concrete:</span>
            <span className="font-medium">{formatCurrency(summaryData.existingConcretePavingCost)}</span>
          </div>
        )}
        {summaryData.extraConcretingCost > 0 && (
          <div className="flex justify-between py-1">
            <span>Extra Concreting:</span>
            <span className="font-medium">{formatCurrency(summaryData.extraConcretingCost)}</span>
          </div>
        )}
      </div>
    </div>
  );
};
