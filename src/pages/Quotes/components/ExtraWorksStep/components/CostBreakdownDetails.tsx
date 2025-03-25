
import { formatCurrency } from "@/utils/format";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { ConcreteLabourCost } from "@/types/concrete-labour-cost";

interface CostBreakdownDetailsProps {
  selectedCategory?: ExtraPavingCost;
  labourCostValue: number;
  labourMarginValue: number;
  costPerMeter: number;
  meters: number;
  totalCost: number;
  totalMargin?: number;
}

export const CostBreakdownDetails = ({
  selectedCategory,
  labourCostValue,
  labourMarginValue,
  costPerMeter,
  meters,
  totalCost,
  totalMargin = 0
}: CostBreakdownDetailsProps) => {
  return (
    <div className="bg-muted/30 p-3 rounded-md border">
      <h4 className="text-sm font-semibold mb-2">Cost Breakdown</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="space-y-1">
          <p className="text-muted-foreground">Per Meter</p>
          <div className="flex justify-between">
            <span>Paver Cost:</span>
            <span>{formatCurrency(selectedCategory?.paver_cost || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Wastage Cost:</span>
            <span>{formatCurrency(selectedCategory?.wastage_cost || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Margin:</span>
            <span>{formatCurrency(selectedCategory?.margin_cost || 0)}</span>
          </div>
          <div className="flex justify-between">
            <span>Labour Cost:</span>
            <span>{formatCurrency(labourCostValue)}</span>
          </div>
          <div className="flex justify-between">
            <span>Labour Margin:</span>
            <span>{formatCurrency(labourMarginValue)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t font-medium">
            <span>Total Per Meter:</span>
            <span>{formatCurrency(costPerMeter)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <p className="text-muted-foreground">Total ({meters} meters)</p>
          <div className="flex justify-between">
            <span>Paver Cost:</span>
            <span>{formatCurrency((selectedCategory?.paver_cost || 0) * meters)}</span>
          </div>
          <div className="flex justify-between">
            <span>Wastage Cost:</span>
            <span>{formatCurrency((selectedCategory?.wastage_cost || 0) * meters)}</span>
          </div>
          <div className="flex justify-between">
            <span>Margin:</span>
            <span>{formatCurrency((selectedCategory?.margin_cost || 0) * meters)}</span>
          </div>
          <div className="flex justify-between">
            <span>Labour Cost:</span>
            <span>{formatCurrency(labourCostValue * meters)}</span>
          </div>
          <div className="flex justify-between">
            <span>Labour Margin:</span>
            <span>{formatCurrency(labourMarginValue * meters)}</span>
          </div>
          <div className="flex justify-between text-primary">
            <span>Total Margin:</span>
            <span>{formatCurrency(totalMargin)}</span>
          </div>
          <div className="flex justify-between pt-1 border-t font-medium">
            <span>Total Cost:</span>
            <span>{formatCurrency(totalCost)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
