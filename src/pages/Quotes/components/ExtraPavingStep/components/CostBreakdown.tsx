
import { PavingSelection } from "../types";

interface CostBreakdownProps {
  activeSelection: PavingSelection;
}

export const CostBreakdown = ({ activeSelection }: CostBreakdownProps) => {
  // Material costs per meter
  const totalMaterialCost = activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost;
  
  // Fixed labour costs per meter
  const laborCost = 100;
  const laborMargin = 30;
  const totalLabourCost = laborCost + laborMargin;
  
  // Total costs for all meters
  const totalMaterialCostAll = totalMaterialCost * activeSelection.meters;
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
          <div className="text-right">${laborCost.toFixed(2)}</div>
          
          <div>Labour Margin:</div>
          <div className="text-right text-green-600">${laborMargin.toFixed(2)}</div>
          
          <div className="border-t pt-1 mt-1 font-medium">Total Labour Cost (per m):</div>
          <div className="text-right border-t pt-1 mt-1 font-medium">${totalLabourCost.toFixed(2)}</div>
          
          <div className="font-medium">Total Labour Cost:</div>
          <div className="text-right font-medium">${totalLabourCostAll.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
