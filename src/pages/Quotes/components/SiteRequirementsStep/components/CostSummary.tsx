
import { Card, CardContent } from "@/components/ui/card";

interface CostSummaryProps {
  siteRequirementsCost: number;
  averageMargin?: number;
}

export const CostSummary = ({ siteRequirementsCost, averageMargin }: CostSummaryProps) => {
  // Only display margin if it's a reasonable value (between 0 and 100)
  const shouldDisplayMargin = averageMargin !== undefined && 
                              averageMargin > 0 && 
                              averageMargin <= 100;
                              
  return (
    <Card className="bg-muted/50">
      <CardContent className="pt-6">
        <div className="flex justify-between text-sm font-medium">
          <span>Additional Site Requirements Cost:</span>
          <div className="text-right">
            <div>${siteRequirementsCost.toFixed(2)}</div>
            {shouldDisplayMargin && (
              <div className="text-xs text-muted-foreground">
                {averageMargin}% avg margin
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
