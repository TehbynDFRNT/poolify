
import React from "react";
import { formatCurrency } from "../utils/formatters";

interface TotalCostItemProps {
  totalCost: number;
  totalMargin: number;
}

export const TotalCostItem: React.FC<TotalCostItemProps> = ({ 
  totalCost, 
  totalMargin 
}) => {
  return (
    <div className="flex justify-between items-center pt-2 border-t font-bold">
      <span>Total Cost</span>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground min-w-[80px] text-right">
          ${formatCurrency(totalMargin)}
        </span>
        <span className="min-w-[80px] text-right">${formatCurrency(totalCost)}</span>
      </div>
    </div>
  );
};
