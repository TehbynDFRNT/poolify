
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { useState, useEffect } from "react";

interface PricingSummaryProps {
  extraPavingOnConcreteCost?: number;
  pavingOnExistingConcreteCost?: number;
}

export const CombinedPricingSummary = ({ 
  extraPavingOnConcreteCost = 0, 
  pavingOnExistingConcreteCost = 0 
}: PricingSummaryProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [totalCost, setTotalCost] = useState(0);

  useEffect(() => {
    const calculatedTotal = extraPavingOnConcreteCost + pavingOnExistingConcreteCost;
    setTotalCost(calculatedTotal);
    
    // Update the quote context with the total cost
    updateQuoteData({ existing_concrete_paving_cost: calculatedTotal });
  }, [extraPavingOnConcreteCost, pavingOnExistingConcreteCost, updateQuoteData]);

  return (
    <Card className="border border-gray-200 mt-8">
      <CardHeader className="bg-white py-4 px-5">
        <CardTitle className="text-lg font-semibold">Combined Pricing Summary</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Extra Paving on Concrete</div>
              <div className="font-medium">${extraPavingOnConcreteCost.toFixed(2)}</div>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <div className="text-sm text-gray-500">Paving on Existing Concrete</div>
              <div className="font-medium">${pavingOnExistingConcreteCost.toFixed(2)}</div>
            </div>
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
