
import { formatCurrency } from "@/utils/format";

interface TrueCostCellProps {
  poolId: string;
  poolCost: Record<string, number>;
  packageInfo: any;
}

export const TrueCostCell = ({ poolId, poolCost, packageInfo }: TrueCostCellProps) => {
  // Calculate the true cost by adding up all pool costs
  // This is a basic implementation that we can enhance later
  const trueCost = Object.values(poolCost).reduce((sum, cost) => sum + (cost || 0), 0);
  
  return <>{formatCurrency(trueCost)}</>;
};
