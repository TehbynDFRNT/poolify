
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PavingSelection } from "../hooks/useExtraPavingQuote";

interface ExtraPavingCostSummaryProps {
  totalCost: number;
  selections: PavingSelection[];
}

export const ExtraPavingCostSummary = ({ totalCost, selections }: ExtraPavingCostSummaryProps) => {
  // Calculate total meters and margins
  const totalMeters = selections.reduce((sum, selection) => sum + selection.meters, 0);
  
  // Calculate materials, labor and margins separately
  const totalMaterialsCost = selections.reduce((sum, selection) => {
    const materialCostPerMeter = selection.paverCost + selection.wastageCost;
    return sum + (materialCostPerMeter * selection.meters);
  }, 0);
  
  const totalMarginCost = selections.reduce((sum, selection) => {
    return sum + (selection.marginCost * selection.meters);
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cost Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1 py-2">
            <div className="text-muted-foreground">Total Paving Meters:</div>
            <div className="text-right font-medium">{totalMeters.toFixed(1)} m</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1 py-2 border-t">
            <div className="text-muted-foreground">Materials Cost:</div>
            <div className="text-right font-medium">${totalMaterialsCost.toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1 py-2">
            <div className="text-muted-foreground">Margin:</div>
            <div className="text-right font-medium">${totalMarginCost.toFixed(2)}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-1 py-2 border-t">
            <div className="font-medium">Total Extra Paving Cost:</div>
            <div className="text-right font-semibold">${totalCost.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
