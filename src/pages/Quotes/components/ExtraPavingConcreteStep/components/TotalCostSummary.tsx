
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { formatCurrency } from "@/utils/format";

export const TotalCostSummary: React.FC = () => {
  const { quoteData } = useQuoteContext();

  // Calculate totals
  const mainPavingCost = quoteData.extra_paving_cost || 0;
  const existingConcretePavingCost = quoteData.existing_concrete_paving_cost || 0;
  
  // Get extra concreting cost from the existing fields
  let extraConcretingCost = 0;
  if (quoteData.extra_concreting && typeof quoteData.extra_concreting === 'string') {
    try {
      const extraConcretingData = JSON.parse(quoteData.extra_concreting);
      extraConcretingCost = extraConcretingData.cost || 0;
    } catch (e) {
      console.error("Error parsing extra concreting data:", e);
    }
  }
  
  const concretePumpCost = quoteData.concrete_pump_required ? (quoteData.concrete_pump_price || 0) : 0;
  const concreteCutsCost = quoteData.concrete_cuts_cost || 0;
  const underFenceStripsCost = quoteData.under_fence_strips_cost || 0;

  // Calculate overall total
  const totalCost = 
    mainPavingCost + 
    existingConcretePavingCost + 
    extraConcretingCost + 
    concretePumpCost + 
    concreteCutsCost + 
    underFenceStripsCost;

  // Helper function to check if section should be displayed
  const shouldDisplaySection = (value: number, additionalCondition = true): boolean => {
    return value > 0 && additionalCondition;
  };

  // Check if any valid paving data exists by looking at selection data
  const hasPavingSelection = Boolean(quoteData.selected_paving_id && quoteData.selected_paving_meters && quoteData.selected_paving_meters > 0);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5">
        <h3 className="text-lg font-medium">Total Paving & Concrete Cost</h3>
      </CardHeader>
      <CardContent className="p-5">
        {totalCost === 0 ? (
          <div className="text-gray-500 text-center py-4">
            No paving or concrete costs have been added yet.
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {shouldDisplaySection(mainPavingCost, hasPavingSelection) && (
                <>
                  <div className="text-gray-600">Extra Paving:</div>
                  <div className="text-right font-medium">{formatCurrency(mainPavingCost)}</div>
                </>
              )}
              
              {shouldDisplaySection(existingConcretePavingCost) && (
                <>
                  <div className="text-gray-600">Paving on Existing Concrete:</div>
                  <div className="text-right font-medium">{formatCurrency(existingConcretePavingCost)}</div>
                </>
              )}
              
              {shouldDisplaySection(extraConcretingCost) && (
                <>
                  <div className="text-gray-600">Extra Concreting:</div>
                  <div className="text-right font-medium">{formatCurrency(extraConcretingCost)}</div>
                </>
              )}
              
              {shouldDisplaySection(concretePumpCost) && (
                <>
                  <div className="text-gray-600">Concrete Pump:</div>
                  <div className="text-right font-medium">{formatCurrency(concretePumpCost)}</div>
                </>
              )}
              
              {shouldDisplaySection(concreteCutsCost) && (
                <>
                  <div className="text-gray-600">Concrete Cuts:</div>
                  <div className="text-right font-medium">{formatCurrency(concreteCutsCost)}</div>
                </>
              )}
              
              {shouldDisplaySection(underFenceStripsCost) && (
                <>
                  <div className="text-gray-600">Under Fence Concrete Strips:</div>
                  <div className="text-right font-medium">{formatCurrency(underFenceStripsCost)}</div>
                </>
              )}
              
              <div className="text-gray-700 font-medium pt-2 mt-2 border-t">Total:</div>
              <div className="text-right font-bold text-lg pt-2 mt-2 border-t">
                {formatCurrency(totalCost)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
