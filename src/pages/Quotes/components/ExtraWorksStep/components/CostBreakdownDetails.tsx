
import { formatCurrency } from "@/utils/format";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface CostBreakdownDetailsProps {
  selectedCategory: ExtraPavingCost | undefined;
  labourCostValue: number;
  labourMarginValue: number;
  costPerMeter: number;
  meters: number;
  totalCost: number;
  totalMargin: number;
}

export const CostBreakdownDetails = ({
  selectedCategory,
  labourCostValue,
  labourMarginValue,
  costPerMeter,
  meters,
  totalCost,
  totalMargin
}: CostBreakdownDetailsProps) => {
  // Safely calculate material costs
  const paverCost = selectedCategory ? selectedCategory.paver_cost : 0;
  const wastageCost = selectedCategory ? selectedCategory.wastage_cost : 0;
  const materialMarginCost = selectedCategory ? selectedCategory.margin_cost : 0;
  
  const totalMaterialCost = paverCost + wastageCost;
  
  // Calculate based on meters
  const totalPaverCost = parseFloat((paverCost * meters).toFixed(2));
  const totalWastageCost = parseFloat((wastageCost * meters).toFixed(2));
  const totalMaterialMargin = parseFloat((materialMarginCost * meters).toFixed(2));
  const totalLabourCost = parseFloat((labourCostValue * meters).toFixed(2));
  const totalLabourMargin = parseFloat((labourMarginValue * meters).toFixed(2));
  
  return (
    <div className="bg-muted p-4 rounded-md text-sm">
      <h4 className="font-medium mb-2">Cost Breakdown</h4>
      <div className="space-y-3">
        <div>
          <h5 className="font-medium">Per Meter Costs:</h5>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>Paver cost:</div>
            <div className="text-right">{formatCurrency(paverCost)}</div>
            
            <div>Wastage cost:</div>
            <div className="text-right">{formatCurrency(wastageCost)}</div>
            
            <div>Material margin:</div>
            <div className="text-right">{formatCurrency(materialMarginCost)}</div>
            
            <div>Labour cost:</div>
            <div className="text-right">{formatCurrency(labourCostValue)}</div>
            
            <div>Labour margin:</div>
            <div className="text-right">{formatCurrency(labourMarginValue)}</div>
            
            <div className="font-medium">Total per meter:</div>
            <div className="text-right font-medium">{formatCurrency(costPerMeter)}</div>
          </div>
        </div>
        
        <div>
          <h5 className="font-medium">Total Costs ({meters} meters):</h5>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div>Paver cost:</div>
            <div className="text-right">{formatCurrency(totalPaverCost)}</div>
            
            <div>Wastage cost:</div>
            <div className="text-right">{formatCurrency(totalWastageCost)}</div>
            
            <div>Material margin:</div>
            <div className="text-right">{formatCurrency(totalMaterialMargin)}</div>
            
            <div>Labour cost:</div>
            <div className="text-right">{formatCurrency(totalLabourCost)}</div>
            
            <div>Labour margin:</div>
            <div className="text-right">{formatCurrency(totalLabourMargin)}</div>
            
            <div className="font-medium">Total margin:</div>
            <div className="text-right font-medium">{formatCurrency(totalMargin)}</div>
            
            <div className="font-medium border-t pt-1">Total cost:</div>
            <div className="text-right font-medium border-t pt-1">{formatCurrency(totalCost)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
