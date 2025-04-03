
import { formatCurrency } from "@/utils/format";
import { useFixedCostsData } from "../hooks/useFixedCostsData";
import { useCraneData } from "../hooks/useCraneData";
import { usePoolDigData } from "../hooks/usePoolDigData";

interface TrueCostCellProps {
  poolId: string;
  poolCost: Record<string, number>;
  packageInfo: any;
}

export const TrueCostCell = ({ poolId, poolCost, packageInfo }: TrueCostCellProps) => {
  // Get fixed costs total
  const { calculateFixedCostsTotal } = useFixedCostsData();
  const fixedCostsTotal = calculateFixedCostsTotal();
  
  // Get excavation cost
  const { calculateExcavationCost } = usePoolDigData();
  const excavationCost = calculateExcavationCost(poolId);
  
  // Get crane cost
  const { getCraneCost } = useCraneData();
  const craneCost = getCraneCost(poolId);
  
  // Get package price
  const packagePrice = packageInfo?.price || 0;
  
  // Calculate construction costs total
  const constructionCostsTotal = Object.values(poolCost).reduce((sum, cost) => sum + (cost || 0), 0);
  
  // Calculate the true cost by adding up all costs
  const trueCost = fixedCostsTotal + excavationCost + craneCost + packagePrice + constructionCostsTotal;
  
  return <>{formatCurrency(trueCost)}</>;
};
