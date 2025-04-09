
import React from "react";
import { formatCurrency } from "../utils/formatters";

interface CostItemProps {
  label: string;
  cost: number;
  margin: number;
  showZero?: boolean;
}

export const CostItem: React.FC<CostItemProps> = ({ 
  label, 
  cost, 
  margin, 
  showZero = false 
}) => {
  // Don't render if cost is zero and showZero is false
  if (cost === 0 && !showZero) {
    return null;
  }

  return (
    <div className="flex justify-between items-center">
      <span>{label}</span>
      <div className="flex items-center gap-4">
        <span className="text-muted-foreground min-w-[80px] text-right">${formatCurrency(margin)}</span>
        <span className="min-w-[80px] text-right">${formatCurrency(cost)}</span>
      </div>
    </div>
  );
};
