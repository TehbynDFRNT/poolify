
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface CostSummaryCardProps {
  poolShellPrice: number;
  filtrationTotal: number;
  totalPoolCosts: number;
  totalFixedCosts: number;
}

export const CostSummaryCard = ({
  poolShellPrice,
  filtrationTotal,
  totalPoolCosts,
  totalFixedCosts,
}: CostSummaryCardProps) => {
  const grandTotal = poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pool Shell Price (inc. GST):</span>
            <span>{formatCurrency(poolShellPrice)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Filtration Package:</span>
            <span>{formatCurrency(filtrationTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Pool Specific Costs:</span>
            <span>{formatCurrency(totalPoolCosts)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Fixed Costs:</span>
            <span>{formatCurrency(totalFixedCosts)}</span>
          </div>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-4 border-t">
          <span>True Cost:</span>
          <span>{formatCurrency(grandTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
