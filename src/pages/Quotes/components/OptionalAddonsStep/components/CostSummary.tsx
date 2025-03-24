
import { Card, CardContent } from "@/components/ui/card";

interface CostSummaryProps {
  totalCost: number;
}

export const CostSummary = ({ totalCost }: CostSummaryProps) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Add-ons Cost:</span>
          <span className="text-lg font-bold">${totalCost.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
