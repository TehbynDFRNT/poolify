
import { formatCurrency } from "@/utils/format";
import { usePoolDigData } from "../hooks/usePoolDigData";

interface ExcavationCellProps {
  poolId: string;
  column: string;
}

export const ExcavationCell = ({ poolId, column }: ExcavationCellProps) => {
  const { calculateExcavationCost, getDigTypeName } = usePoolDigData();
  
  if (column === "dig_type") {
    return <>{getDigTypeName(poolId)}</>;
  } else if (column === "dig_total") {
    const digTotal = calculateExcavationCost(poolId);
    return <>{formatCurrency(digTotal)}</>;
  } else if (column === "excavation") {
    const excavationCost = calculateExcavationCost(poolId);
    return <>{formatCurrency(excavationCost)}</>;
  }
  
  return null;
};
