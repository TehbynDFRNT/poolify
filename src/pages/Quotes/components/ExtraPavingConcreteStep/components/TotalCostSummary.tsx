
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, DollarSign } from "lucide-react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { Skeleton } from "@/components/ui/skeleton";

interface CostItem {
  name: string;
  cost: number;
  margin?: number;
}

export const TotalCostSummary: React.FC = () => {
  const { quoteData, isLoading } = useQuoteContext();
  const [costItems, setCostItems] = useState<CostItem[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);

  useEffect(() => {
    if (!quoteData) return;

    const items: CostItem[] = [];

    // 1. Extra Paving
    if (quoteData.selected_paving_cost && quoteData.selected_paving_cost > 0) {
      items.push({
        name: "Extra Paving",
        cost: quoteData.selected_paving_cost,
        margin: quoteData.selected_paving_margin || 0
      });
    }

    // 2. Paving on Existing Concrete
    if (quoteData.existing_concrete_paving_cost && quoteData.existing_concrete_paving_cost > 0) {
      items.push({
        name: "Paving on Existing Concrete",
        cost: quoteData.existing_concrete_paving_cost,
        // Margin isn't stored separately for this, so we estimate
        margin: quoteData.existing_concrete_paving_cost * 0.15
      });
    }

    // 3. Extra Concreting
    if (quoteData.extra_concreting_cost && quoteData.extra_concreting_cost > 0) {
      items.push({
        name: "Extra Concreting",
        cost: quoteData.extra_concreting_cost,
        margin: quoteData.extra_concreting_margin || 0
      });
    }

    // 4. Concrete Pump
    if (quoteData.concrete_pump_required && quoteData.concrete_pump_price && quoteData.concrete_pump_price > 0) {
      items.push({
        name: "Concrete Pump",
        cost: quoteData.concrete_pump_price,
        // Margin isn't stored separately for this
        margin: quoteData.concrete_pump_price * 0.10
      });
    }

    // 5. Concrete Cuts
    if (quoteData.concrete_cuts_cost && quoteData.concrete_cuts_cost > 0) {
      items.push({
        name: "Concrete Cuts",
        cost: quoteData.concrete_cuts_cost,
        // Margin isn't stored separately for this
        margin: quoteData.concrete_cuts_cost * 0.15
      });
    }

    // 6. Under Fence Concrete Strips
    if (quoteData.under_fence_strips_cost && quoteData.under_fence_strips_cost > 0) {
      items.push({
        name: "Under Fence Concrete Strips",
        cost: quoteData.under_fence_strips_cost,
        // Try to extract margin from JSON data if available
        margin: extractUnderFenceMargin(quoteData.under_fence_strips_data)
      });
    }

    setCostItems(items);
    
    // Calculate totals
    const total = items.reduce((sum, item) => sum + item.cost, 0);
    const margin = items.reduce((sum, item) => sum + (item.margin || 0), 0);
    
    setTotalCost(total);
    setTotalMargin(margin);
  }, [quoteData]);

  const extractUnderFenceMargin = (jsonData: any): number => {
    if (!jsonData) return 0;
    
    try {
      const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      
      if (Array.isArray(data)) {
        // Sum up margins from all selected strips
        return data.reduce((total, strip) => {
          const margin = strip.margin || 0;
          const quantity = strip.quantity || 1;
          return total + (margin * quantity);
        }, 0);
      }
    } catch (error) {
      console.error("Error parsing under fence strips data:", error);
    }
    
    return 0;
  };

  if (isLoading) {
    return (
      <Card className="border border-gray-200">
        <CardHeader className="bg-white py-4 px-5">
          <Skeleton className="h-8 w-64" />
        </CardHeader>
        <CardContent className="p-5">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-gray-500" />
          <CardTitle className="text-lg font-medium">Extra Paving & Concrete Summary</CardTitle>
        </div>
        <div className="text-right">
          <div className="text-lg font-semibold text-green-600">
            Total: ${totalCost.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {costItems.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No extra paving or concrete options selected yet.
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="py-2 px-3 text-left">Item</th>
                    <th className="py-2 px-3 text-right">Cost</th>
                    <th className="py-2 px-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {costItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-3 px-3 text-sm">{item.name}</td>
                      <td className="py-3 px-3 text-sm text-right">${item.cost.toFixed(2)}</td>
                      <td className="py-3 px-3 text-sm text-right text-green-600">
                        ${(item.margin || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 font-medium">
                  <tr>
                    <td className="py-3 px-3">Total</td>
                    <td className="py-3 px-3 text-right">${totalCost.toFixed(2)}</td>
                    <td className="py-3 px-3 text-right text-green-600">${totalMargin.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Summary of all extra paving and concrete options
              </div>
              <div className="flex items-center gap-2 text-xl font-semibold">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span>${totalCost.toFixed(2)}</span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
