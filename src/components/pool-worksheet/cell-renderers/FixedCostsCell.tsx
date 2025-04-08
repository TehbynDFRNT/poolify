
import { formatCurrency } from "@/utils/format";
import { useFixedCostsData } from "../hooks/useFixedCostsData";
import { useEffect } from "react";

interface FixedCostsCellProps {
  column: string;
}

export const FixedCostsCell = ({ column }: FixedCostsCellProps) => {
  const { fixedCosts, calculateFixedCostsTotal } = useFixedCostsData();
  
  if (column === "fixed_costs_total") {
    const total = calculateFixedCostsTotal();
    return <>{formatCurrency(total)}</>;
  }
  
  if (column.startsWith('fixed_cost_') && fixedCosts) {
    const fixedCostId = column.replace('fixed_cost_', '');
    const fixedCost = fixedCosts.find(cost => cost.id === fixedCostId);
    
    if (fixedCost) {
      return <>{formatCurrency(fixedCost.price)}</>;
    }
  }
  
  return null;
};
