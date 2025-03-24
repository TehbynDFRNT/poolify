
import { Card, CardContent } from "@/components/ui/card";

interface CostSummaryProps {
  siteRequirementsCost: number;
}

export const CostSummary = ({ siteRequirementsCost }: CostSummaryProps) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex justify-between text-sm font-medium">
          <span>Additional Site Requirements Cost:</span>
          <span>${siteRequirementsCost.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  );
};
