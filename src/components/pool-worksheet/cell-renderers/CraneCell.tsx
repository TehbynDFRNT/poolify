
import { formatCurrency } from "@/utils/format";
import { useCraneData } from "../hooks/useCraneData";

interface CraneCellProps {
  poolId: string;
  column: string;
}

export const CraneCell = ({ poolId, column }: CraneCellProps) => {
  const { getCraneName, getCraneCost } = useCraneData();
  
  if (column === "crane_type") {
    return <>{getCraneName(poolId)}</>;
  } else if (column === "crane_cost") {
    return <>{formatCurrency(getCraneCost(poolId))}</>;
  }
  
  return null;
};
