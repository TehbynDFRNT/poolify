
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

type CostSummaryCardProps = {
  poolShellPrice: number;
  filtrationTotal: number;
  totalPoolCosts: number;
  totalFixedCosts: number;
};

export const CostSummaryCard = ({
  poolShellPrice,
  filtrationTotal,
  totalPoolCosts,
  totalFixedCosts,
}: CostSummaryCardProps) => {
  const trueTotal = poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <span>Pool Shell Price (inc. GST):</span>
          <span className="text-right">{formatCurrency(poolShellPrice)}</span>
          
          <span>Filtration Package:</span>
          <span className="text-right">{formatCurrency(filtrationTotal)}</span>
          
          <span>Pool Specific Costs:</span>
          <span className="text-right">{formatCurrency(totalPoolCosts)}</span>
          
          <span>Fixed Costs:</span>
          <span className="text-right">{formatCurrency(totalFixedCosts)}</span>
        </div>
        
        <div className="border-t pt-4 grid grid-cols-2 gap-2 font-semibold">
          <span>True Cost:</span>
          <span className="text-right">{formatCurrency(trueTotal)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
