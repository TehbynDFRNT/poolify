
import React from "react";
import { formatCurrency } from "@/utils/format";
import { PoolCosts } from "./PoolCostGrid";

interface PoolCostSummaryProps {
  costs: PoolCosts;
}

const PoolCostSummary: React.FC<PoolCostSummaryProps> = ({ costs }) => {
  const totalCosts = Object.values(costs).reduce((sum, cost) => sum + cost, 0);
  
  return (
    <div className="flex justify-end border-t pt-4">
      <div className="text-lg font-medium">
        Total Costs: {formatCurrency(totalCosts)}
      </div>
    </div>
  );
};

export default PoolCostSummary;
