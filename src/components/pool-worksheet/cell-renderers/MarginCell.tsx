
import { formatCurrency } from "@/utils/format";
import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";

interface MarginCellProps {
  poolId: string;
}

export const MarginCell = ({ poolId }: MarginCellProps) => {
  const { marginData } = useMargin(poolId);
  
  // Format the margin as a percentage with % symbol
  const formattedMargin = marginData 
    ? `${marginData.toFixed(2)}%` 
    : "-";
  
  return <>{formattedMargin}</>;
};
