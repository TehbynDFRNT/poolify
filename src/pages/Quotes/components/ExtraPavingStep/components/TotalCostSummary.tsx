
import { FC } from 'react';

interface TotalCostSummaryProps {
  pavingTotal: number;
  layingTotal: number;
  isPumpRequired: boolean;
  pumpPrice: number;
  concreteCutsCost: number;
  underFenceStripsCost: number;
  totalCost: number;
}

export const TotalCostSummary: FC<TotalCostSummaryProps> = ({
  pavingTotal,
  layingTotal,
  isPumpRequired,
  pumpPrice,
  concreteCutsCost,
  underFenceStripsCost,
  totalCost
}) => {
  return (
    <div className="bg-slate-50 p-4 rounded-md">
      <h3 className="font-medium text-lg mb-2">Total Cost Summary</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Paving Materials:</span>
          <span>${pavingTotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Concrete Labour:</span>
          <span>${layingTotal.toFixed(2)}</span>
        </div>
        
        {isPumpRequired && pumpPrice > 0 && (
          <div className="flex justify-between">
            <span>Concrete Pump:</span>
            <span>${pumpPrice.toFixed(2)}</span>
          </div>
        )}
        
        {concreteCutsCost > 0 && (
          <div className="flex justify-between">
            <span>Concrete Cuts:</span>
            <span>${concreteCutsCost.toFixed(2)}</span>
          </div>
        )}
        
        {underFenceStripsCost > 0 && (
          <div className="flex justify-between">
            <span>Under Fence Concrete Strips:</span>
            <span>${underFenceStripsCost.toFixed(2)}</span>
          </div>
        )}
        
        <div className="flex justify-between font-bold border-t pt-2 mt-2">
          <span>Total:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
