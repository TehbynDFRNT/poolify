
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
  // Check if any sections are available
  const hasMaterialCosts = pavingTotal > 0 || concreteTotal > 0;
  const hasLabourCosts = layingTotal > 0;
  const hasPumpCosts = isPumpRequired && pumpPrice > 0;
  const hasConcreteCuts = concreteCutsCost > 0;
  const hasFenceStrips = underFenceStripsCost > 0;
  const hasExistingConcrete = existingConcretePavingCost > 0;
  
  const hasAnyCosts = 
    hasMaterialCosts || 
    hasLabourCosts || 
    hasPumpCosts || 
    hasConcreteCuts || 
    hasFenceStrips || 
    hasExistingConcrete;

  return (
    <div className="bg-white border rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium mb-4">Cost Summary</h3>
      
      {!hasAnyCosts ? (
        <div className="text-gray-500 text-center py-2">
          No paving or concrete costs have been added yet.
        </div>
      ) : (
        <>
          <div className="space-y-2 mb-4">
            {hasMaterialCosts && (
              <div className="flex justify-between">
                <span>Paving Material:</span>
                <span className="font-medium">${pavingTotal.toFixed(2)}</span>
              </div>
            )}
            
            {concreteTotal > 0 && (
              <div className="flex justify-between">
                <span>Concrete Material:</span>
                <span className="font-medium">${concreteTotal.toFixed(2)}</span>
              </div>
            )}
            
            {hasLabourCosts && (
              <div className="flex justify-between">
                <span>Labour:</span>
                <span className="font-medium">${layingTotal.toFixed(2)}</span>
              </div>
            )}
            
            {hasPumpCosts && (
              <div className="flex justify-between">
                <span>Concrete Pump:</span>
                <span className="font-medium">${pumpPrice.toFixed(2)}</span>
              </div>
            )}
            
            {hasConcreteCuts && (
              <div className="flex justify-between">
                <span>Concrete Cuts:</span>
                <span className="font-medium">${concreteCutsCost.toFixed(2)}</span>
              </div>
            )}
            
            {hasFenceStrips && (
              <div className="flex justify-between">
                <span>Under Fence Concrete Strips:</span>
                <span className="font-medium">${underFenceStripsCost.toFixed(2)}</span>
              </div>
            )}
            
            {hasExistingConcrete && (
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
        </>
      )}
    </div>
  );
};
