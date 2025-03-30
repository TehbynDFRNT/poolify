
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

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
  
  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5">
        <CardTitle className="text-lg font-semibold">Total Extra Paving & Concrete Cost</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Paving Materials</div>
              <div className="font-medium">${pavingTotal.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Concrete Materials</div>
              <div className="font-medium">${concreteTotal.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Laying Labour</div>
              <div className="font-medium">${layingTotal.toFixed(2)}</div>
            </div>
            {isPumpRequired && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Concrete Pump</div>
                <div className="font-medium">${pumpPrice.toFixed(2)}</div>
              </div>
            )}
            {concreteCutsCost > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Concrete Cuts</div>
                <div className="font-medium">${concreteCutsCost.toFixed(2)}</div>
              </div>
            )}
            {underFenceStripsCost > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Under Fence Concrete Strips</div>
                <div className="font-medium">${underFenceStripsCost.toFixed(2)}</div>
              </div>
            )}
            {existingConcretePavingCost > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <div className="text-sm text-gray-500">Paving on Existing Concrete</div>
                <div className="font-medium">${existingConcretePavingCost.toFixed(2)}</div>
              </div>
            )}
          </div>
          
          <div className="border-t pt-3 mt-2">
            <div className="flex justify-between items-center">
              <div className="font-semibold">Total Cost:</div>
              <div className="text-lg font-bold">${totalCost.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
