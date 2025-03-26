
import { FC } from 'react';

interface TotalCostSummaryProps {
  pavingTotal: number;
  layingTotal: number;
  concreteTotal: number;
  isPumpRequired: boolean;
  pumpPrice: number;
  concreteCutsCost: number;
  underFenceStripsCost: number;
  totalCost: number;
}

export const TotalCostSummary: FC<TotalCostSummaryProps> = ({
  pavingTotal = 0,
  layingTotal = 0,
  concreteTotal = 0,
  isPumpRequired = false,
  pumpPrice = 0,
  concreteCutsCost = 0,
  underFenceStripsCost = 0,
  totalCost = 0
}) => {
  // Ensure all values are numbers to prevent errors with toFixed
  const safeNumber = (value: any): number => {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return 0;
    }
    return Number(value);
  };

  const safePavingTotal = safeNumber(pavingTotal);
  const safeLayingTotal = safeNumber(layingTotal);
  const safeConcreteTotal = safeNumber(concreteTotal);
  const safePumpPrice = safeNumber(pumpPrice);
  const safeConcreteCutsCost = safeNumber(concreteCutsCost);
  const safeUnderFenceStripsCost = safeNumber(underFenceStripsCost);
  const safeTotalCost = safeNumber(totalCost);

  return (
    <div className="bg-slate-50 p-4 rounded-md">
      <h3 className="font-medium text-lg mb-2">Total Cost Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Paving Materials:</span>
          <span>${safePavingTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Concrete Materials:</span>
          <span>${safeConcreteTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Concrete Labour:</span>
          <span>${safeLayingTotal.toFixed(2)}</span>
        </div>
        
        {isPumpRequired && safePumpPrice > 0 && (
          <div className="flex justify-between">
            <span>Concrete Pump:</span>
            <span>${safePumpPrice.toFixed(2)}</span>
          </div>
        )}
        
        {safeConcreteCutsCost > 0 && (
          <div className="flex justify-between">
            <span>Concrete Cuts:</span>
            <span>${safeConcreteCutsCost.toFixed(2)}</span>
          </div>
        )}
        
        {safeUnderFenceStripsCost > 0 && (
          <div className="flex justify-between">
            <span>Under Fence Concrete Strips:</span>
            <span>${safeUnderFenceStripsCost.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${safeTotalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
