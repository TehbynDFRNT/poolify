
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  
  // Calculate the final total including existing concrete paving
  const finalTotal = totalCost + existingConcretePavingCost;

  return (
    <Card className="border-2 border-green-100 bg-green-50">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold mb-3">Total Paving & Concrete Cost Summary</h3>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-1">
            <div className="text-gray-600">Paving Materials:</div>
            <div className="text-right font-medium">${pavingTotal.toFixed(2)}</div>
            
            <div className="text-gray-600">Concrete Materials:</div>
            <div className="text-right font-medium">${concreteTotal.toFixed(2)}</div>
            
            <div className="text-gray-600">Laying Labor:</div>
            <div className="text-right font-medium">${layingTotal.toFixed(2)}</div>
            
            {isPumpRequired && (
              <>
                <div className="text-gray-600">Concrete Pump:</div>
                <div className="text-right font-medium">${pumpPrice.toFixed(2)}</div>
              </>
            )}
            
            {concreteCutsCost > 0 && (
              <>
                <div className="text-gray-600">Concrete Cuts:</div>
                <div className="text-right font-medium">${concreteCutsCost.toFixed(2)}</div>
              </>
            )}
            
            {underFenceStripsCost > 0 && (
              <>
                <div className="text-gray-600">Under Fence Strips:</div>
                <div className="text-right font-medium">${underFenceStripsCost.toFixed(2)}</div>
              </>
            )}
            
            {existingConcretePavingCost > 0 && (
              <>
                <div className="text-gray-600">Paving on Existing Concrete:</div>
                <div className="text-right font-medium">${existingConcretePavingCost.toFixed(2)}</div>
              </>
            )}
            
            <div className="border-t border-gray-300 pt-1 mt-1 font-semibold">Total:</div>
            <div className="border-t border-gray-300 pt-1 mt-1 font-semibold text-right">${finalTotal.toFixed(2)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
