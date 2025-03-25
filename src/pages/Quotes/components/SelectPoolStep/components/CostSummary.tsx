
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface CostSummaryProps {
  costs: {
    basePrice: number;
    filtrationCost: number;
    fixedCostsTotal: number;
    individualCostsTotal: number;
    excavationCost: number;
    total: number;
    marginPercentage: number;
    rrp: number;
    actualMargin: number;
  };
  excavationName?: string;
  filtrationDisplayOrder?: number;
}

export const CostSummary = ({ costs, excavationName, filtrationDisplayOrder }: CostSummaryProps) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm">Base Pool Price</span>
            <span className="text-sm font-medium">{formatCurrency(costs.basePrice)}</span>
          </div>
          {costs.filtrationCost > 0 && (
            <div className="flex justify-between">
              <span className="text-sm">Filtration Package {filtrationDisplayOrder ? `(Option ${filtrationDisplayOrder})` : ''}</span>
              <span className="text-sm font-medium">{formatCurrency(costs.filtrationCost)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-sm">Fixed Costs</span>
            <span className="text-sm font-medium">{formatCurrency(costs.fixedCostsTotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Individual Costs</span>
            <span className="text-sm font-medium">{formatCurrency(costs.individualCostsTotal)}</span>
          </div>
          {costs.excavationCost > 0 && (
            <div className="flex justify-between">
              <span className="text-sm">Excavation {excavationName ? `(${excavationName})` : ''}</span>
              <span className="text-sm font-medium">{formatCurrency(costs.excavationCost)}</span>
            </div>
          )}
          <div className="border-t pt-2 mt-2 flex justify-between">
            <span className="font-medium">Total Cost</span>
            <span className="font-medium text-primary">{formatCurrency(costs.total)}</span>
          </div>
          
          {/* Margin Information */}
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <div className="text-sm text-muted-foreground">Margin %</div>
                <div className="text-sm font-medium">{costs.marginPercentage.toFixed(2)}%</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <div className="text-sm text-muted-foreground">Web Price</div>
                <div className="text-sm font-medium text-primary">{formatCurrency(costs.rrp)}</div>
              </div>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <div className="text-sm text-muted-foreground">Actual Margin</div>
                <div className="text-sm font-medium text-primary">{formatCurrency(costs.actualMargin)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
