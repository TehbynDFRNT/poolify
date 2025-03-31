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

// Add existingConcretePavingCost to props
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
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
      
      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>Paving Material:</span>
          <span className="font-medium">${pavingTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Concrete Material:</span>
          <span className="font-medium">${concreteTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Labour:</span>
          <span className="font-medium">${layingTotal.toFixed(2)}</span>
        </div>
        
        {isPumpRequired && (
          <div className="flex justify-between">
            <span>Concrete Pump:</span>
            <span className="font-medium">${pumpPrice.toFixed(2)}</span>
          </div>
        )}
        
        {concreteCutsCost > 0 && (
          <div className="flex justify-between">
            <span>Concrete Cuts:</span>
            <span className="font-medium">${concreteCutsCost.toFixed(2)}</span>
          </div>
        )}
        
        {underFenceStripsCost > 0 && (
          <div className="flex justify-between">
            <span>Under Fence Concrete Strips:</span>
            <span className="font-medium">${underFenceStripsCost.toFixed(2)}</span>
          </div>
        )}
        
        {existingConcretePavingCost > 0 && (
          <div className="flex justify-between">
            <span>Paving on Existing Concrete:</span>
            <span className="font-medium">${existingConcretePavingCost.toFixed(2)}</span>
          </div>
        )}
      </div>
      
      <div className="border-t pt-2 flex justify-between font-bold text-lg">
        <span>Total Extra Paving Cost:</span>
        <span>${(totalCost + existingConcretePavingCost).toFixed(2)}</span>
      </div>
    </div>
  );
};
