
import { formatCurrency } from "@/utils/format";
import { ExcavationCell } from "./ExcavationCell";

interface ConstructionCostsCellProps {
  poolId: string;
  column: string;
  poolCost: Record<string, number>;
}

export const ConstructionCostsCell = ({ poolId, column, poolCost }: ConstructionCostsCellProps) => {
  if (column === "excavation") {
    return <ExcavationCell poolId={poolId} column={column} />;
  } else if (column === "total_cost") {
    // Calculate the total cost
    const { calculateExcavationCost } = require("../hooks/usePoolDigData")();
    const excavationCost = calculateExcavationCost(poolId);
    const total = 
      excavationCost + 
      (poolCost.pea_gravel || 0) + 
      (poolCost.install_fee || 0) + 
      (poolCost.trucked_water || 0) + 
      (poolCost.salt_bags || 0) + 
      (poolCost.coping_supply || 0) + 
      (poolCost.beam || 0) + 
      (poolCost.coping_lay || 0);
    
    return <>{formatCurrency(total)}</>;
  } else if ([
    "pea_gravel", 
    "install_fee", 
    "trucked_water", 
    "salt_bags", 
    "coping_supply", 
    "beam", 
    "coping_lay"
  ].includes(column)) {
    return <>{formatCurrency(poolCost[column] || 0)}</>;
  }
  
  return null;
};
