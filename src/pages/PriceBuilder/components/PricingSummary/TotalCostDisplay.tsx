
import React from 'react';
import { formatCurrency } from "@/utils/format";

interface TotalCostDisplayProps {
  grandTotal: number;
}

export const TotalCostDisplay = ({ grandTotal }: TotalCostDisplayProps) => {
  return (
    <div className="flex justify-between items-center p-6 bg-primary/10 rounded-lg mt-6">
      <span className="text-base font-semibold text-primary">True Cost</span>
      <span className="text-xl font-bold text-primary">
        {formatCurrency(grandTotal)}
      </span>
    </div>
  );
};
