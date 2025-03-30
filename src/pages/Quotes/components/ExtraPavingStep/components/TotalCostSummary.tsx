
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { formatCurrency } from "@/utils/format";

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

export const TotalCostSummary = ({
  pavingTotal,
  layingTotal,
  concreteTotal,
  isPumpRequired,
  pumpPrice,
  concreteCutsCost,
  underFenceStripsCost,
  totalCost
}: TotalCostSummaryProps) => {
  const { quoteData } = useQuoteContext();
  const existingConcretePavingCost = quoteData.existing_concrete_paving_cost || 0;

  // Add existing concrete paving cost to the total
  const grandTotal = totalCost + existingConcretePavingCost;

  return (
    <div className="bg-white border border-gray-200 rounded-md p-5">
      <h3 className="text-lg font-medium mb-4">Total Cost Summary</h3>
      
      <div className="space-y-2">
        <div className="grid grid-cols-2 py-1">
          <span className="text-gray-600">Paving Materials:</span>
          <span className="text-right font-medium">{formatCurrency(pavingTotal)}</span>
        </div>
        
        <div className="grid grid-cols-2 py-1">
          <span className="text-gray-600">Concrete Materials:</span>
          <span className="text-right font-medium">{formatCurrency(concreteTotal)}</span>
        </div>
        
        <div className="grid grid-cols-2 py-1">
          <span className="text-gray-600">Labour (Laying):</span>
          <span className="text-right font-medium">{formatCurrency(layingTotal)}</span>
        </div>
        
        {isPumpRequired && (
          <div className="grid grid-cols-2 py-1">
            <span className="text-gray-600">Concrete Pump:</span>
            <span className="text-right font-medium">{formatCurrency(pumpPrice)}</span>
          </div>
        )}
        
        {concreteCutsCost > 0 && (
          <div className="grid grid-cols-2 py-1">
            <span className="text-gray-600">Concrete Cuts:</span>
            <span className="text-right font-medium">{formatCurrency(concreteCutsCost)}</span>
          </div>
        )}
        
        {underFenceStripsCost > 0 && (
          <div className="grid grid-cols-2 py-1">
            <span className="text-gray-600">Under Fence Concrete Strips:</span>
            <span className="text-right font-medium">{formatCurrency(underFenceStripsCost)}</span>
          </div>
        )}
        
        {existingConcretePavingCost > 0 && (
          <div className="grid grid-cols-2 py-1">
            <span className="text-gray-600">Paving on Existing Concrete:</span>
            <span className="text-right font-medium">{formatCurrency(existingConcretePavingCost)}</span>
          </div>
        )}
        
        <div className="grid grid-cols-2 pt-2 mt-1 border-t border-gray-200">
          <span className="font-semibold">Total Extra Paving Cost:</span>
          <span className="text-right font-bold">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
};
