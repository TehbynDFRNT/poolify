
import React from "react";

interface TotalCostSummaryProps {
  pavingTotal: number;
  layingTotal: number;
  concreteTotal: number;
  isPumpRequired: boolean;
  pumpPrice: number;
  concreteCutsCost: number;
  underFenceStripsCost: number;
  totalCost: number;
  existingConcretePavingCost?: number;
}

export const TotalCostSummary = ({
  pavingTotal,
  layingTotal,
  concreteTotal,
  isPumpRequired,
  pumpPrice,
  concreteCutsCost,
  underFenceStripsCost,
  totalCost,
  existingConcretePavingCost = 0
}: TotalCostSummaryProps) => {
  return (
    <div className="bg-gray-50 rounded-lg border border-gray-200 p-5">
      <h3 className="text-lg font-semibold mb-4">Cost Summary</h3>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-600">Paving Materials:</span>
          <span className="text-right font-medium">${pavingTotal.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-600">Paving Labour:</span>
          <span className="text-right font-medium">${layingTotal.toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-1">
          <span className="text-gray-600">Concrete Materials:</span>
          <span className="text-right font-medium">${concreteTotal.toFixed(2)}</span>
        </div>
        
        {isPumpRequired && (
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-600">Concrete Pump:</span>
            <span className="text-right font-medium">${pumpPrice.toFixed(2)}</span>
          </div>
        )}
        
        {concreteCutsCost > 0 && (
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-600">Concrete Cuts:</span>
            <span className="text-right font-medium">${concreteCutsCost.toFixed(2)}</span>
          </div>
        )}
        
        {underFenceStripsCost > 0 && (
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-600">Under Fence Concrete Strips:</span>
            <span className="text-right font-medium">${underFenceStripsCost.toFixed(2)}</span>
          </div>
        )}
        
        {existingConcretePavingCost > 0 && (
          <div className="grid grid-cols-2 gap-1">
            <span className="text-gray-600">Paving on Existing Concrete:</span>
            <span className="text-right font-medium">${existingConcretePavingCost.toFixed(2)}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-1 pt-2 mt-2 border-t border-gray-200">
          <span className="text-gray-800 font-semibold">Total:</span>
          <span className="text-right font-bold text-blue-600">${(totalCost + existingConcretePavingCost).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
