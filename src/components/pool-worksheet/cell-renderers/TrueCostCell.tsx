
import { formatCurrency } from "@/utils/format";

interface TrueCostCellProps {
  poolId: string;
  poolCost: Record<string, number>;
  packageInfo: any;
}

export const TrueCostCell = ({ poolId, poolCost, packageInfo }: TrueCostCellProps) => {
  // This is a placeholder - we'll implement the actual calculation logic later
  // For now, we're just displaying a placeholder value
  return <>{formatCurrency(0)}</>;
};
