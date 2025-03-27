
import React from "react";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface CostDisplayProps {
  totalCost: number;
  itemPrice: number;
  meterage: number;
  isVisible: boolean;
  isLoading: boolean;
}

export const CostDisplay: React.FC<CostDisplayProps> = ({
  totalCost,
  itemPrice,
  meterage,
  isVisible,
  isLoading
}) => {
  if (isLoading) {
    return <Skeleton className="h-20 w-full" />;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-md border border-gray-200">
      <div className="flex justify-between">
        <span className="font-medium">Total Cost:</span>
        <span className="font-bold">{formatCurrency(totalCost)}</span>
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Calculation: {formatCurrency(itemPrice)} × {meterage} m²
      </div>
    </div>
  );
};
