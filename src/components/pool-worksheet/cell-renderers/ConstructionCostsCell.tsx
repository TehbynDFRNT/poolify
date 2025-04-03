
import { formatCurrency } from "@/utils/format";
import { ExcavationCell } from "./ExcavationCell";
import { usePoolDigData } from "../hooks/usePoolDigData";

interface ConstructionCostsCellProps {
  poolId: string;
  column: string;
  poolCost: Record<string, number>;
}

export const ConstructionCostsCell = ({ poolId, column, poolCost }: ConstructionCostsCellProps) => {
  const { calculateExcavationCost } = usePoolDigData();
  
  if (column === "excavation") {
    return <ExcavationCell poolId={poolId} column={column} />;
  } else if (column === "total_cost") {
    // Calculate the total cost of ONLY the construction costs without excavation
    // This should match the calculation on the Pool Individual Costs page
    const total = 
      (poolCost.pea_gravel || 0) + 
      (poolCost.install_fee || 0) + 
      (poolCost.trucked_water || 0) + 
      (poolCost.salt_bags || 0) + 
      (poolCost.coping_supply || 0) + 
      (poolCost.beam || 0) + 
      (poolCost.coping_lay || 0);
    
    // Log the values for debugging
    console.log(`Construction costs total for pool ${poolId}:`, {
      pea_gravel: poolCost.pea_gravel || 0,
      install_fee: poolCost.install_fee || 0,
      trucked_water: poolCost.trucked_water || 0,
      salt_bags: poolCost.salt_bags || 0,
      coping_supply: poolCost.coping_supply || 0,
      beam: poolCost.beam || 0,
      coping_lay: poolCost.coping_lay || 0,
      total: total
    });
    
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
