
import React from "react";
import { DollarSign, Calculator } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { SummaryData } from "@/hooks/useConcretePavingSummary";

interface CostTotalsProps {
  summaryData: SummaryData;
}

export const CostTotals: React.FC<CostTotalsProps> = ({ summaryData }) => {
  return (
    <div className="border-t pt-4 mt-2">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium flex items-center">
            <DollarSign className="h-4 w-4 mr-1 text-primary" />
            Total Concrete & Paving Cost:
          </span>
          <span className="text-lg font-bold text-primary">
            {formatCurrency(summaryData.totalCost)}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span className="flex items-center">
            <Calculator className="h-4 w-4 mr-1 text-primary" />
            Total Margin:
          </span>
          <span>{formatCurrency(summaryData.totalMargin)}</span>
        </div>
      </div>
    </div>
  );
};
