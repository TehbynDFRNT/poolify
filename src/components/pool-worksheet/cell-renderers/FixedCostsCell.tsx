
import { formatCurrency } from "@/utils/format";
import { useFixedCostsData } from "../hooks/useFixedCostsData";
import { useEffect } from "react";

interface FixedCostsCellProps {
  column: string;
}

export const FixedCostsCell = ({ column }: FixedCostsCellProps) => {
  const { fixedCosts, calculateFixedCostsTotal, fixedCostColumnsSetup } = useFixedCostsData();
  
  useEffect(() => {
    console.log("FixedCostsCell mounted for column:", column);
    console.log("Fixed costs data:", fixedCosts);
    console.log("Columns setup completed:", fixedCostColumnsSetup);
  }, [column, fixedCosts, fixedCostColumnsSetup]);
  
  if (column === "fixed_costs_total") {
    const total = calculateFixedCostsTotal();
    console.log("Rendering fixed costs total:", total);
    return <>{formatCurrency(total)}</>;
  }
  
  if (column.startsWith('fixed_cost_') && fixedCosts) {
    const fixedCostId = column.replace('fixed_cost_', '');
    const fixedCost = fixedCosts.find(cost => cost.id === fixedCostId);
    console.log(`Rendering fixed cost ${fixedCostId}:`, fixedCost);
    
    if (fixedCost) {
      return <>{formatCurrency(fixedCost.price)}</>;
    }
  }
  
  return null;
};
