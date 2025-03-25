
import { PavingSelection } from "../types";

interface CostBreakdownProps {
  activeSelection: PavingSelection;
}

export const CostBreakdown = ({ activeSelection }: CostBreakdownProps) => {
  const totalMaterialCost = activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost;
  const totalMaterialCostAll = totalMaterialCost * activeSelection.meters;
  
  const totalLabourCost = 100 + 30; // Labour cost + margin
  const totalLabourCostAll = totalLabourCost * activeSelection.meters;
  
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      <div className="col-span-2 mt-2 mb-1">
        <h3 className="font-semibold text-gray-700">Cost Breakdown</h3>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Materials (per meter)</h4>
        <div className="grid grid-cols-2 gap-y-1">
          <div>Paver Cost:</div>
          <div className="text-right">${activeSelection.paverCost.toFixed(2)}</div>
          
          <div>Wastage Cost:</div>
          <div className="text-right">${activeSelection.wastageCost.toFixed(2)}</div>
          
          <div>Material Margin:</div>
          <div className="text-right text-green-600">${activeSelection.marginCost.toFixed(2)}</div>
          
          <div className="border-t pt-1 mt-1 font-medium">Total Material Cost (per m):</div>
          <div className="text-right border-t pt-1 mt-1 font-medium">${totalMaterialCost.toFixed(2)}</div>
          
          <div className="font-medium">Total Materials Cost:</div>
          <div className="text-right font-medium">${totalMaterialCostAll.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Labour (per meter)</h4>
        <div className="grid grid-cols-2 gap-y-1">
          <div>Labour Cost:</div>
          <div className="text-right">$100.00</div>
          
          <div>Labour Margin:</div>
          <div className="text-right text-green-600">$30.00</div>
          
          <div className="border-t pt-1 mt-1 font-medium">Total Labour Cost (per m):</div>
          <div className="text-right border-t pt-1 mt-1 font-medium">$130.00</div>
          
          <div className="font-medium">Total Labour Cost:</div>
          <div className="text-right font-medium">${totalLabourCostAll.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
