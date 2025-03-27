
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/utils/format";

export const PageSummary = () => {
  const { quoteData } = useQuoteContext();
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Get values from quote data
  const existingConcretePavingCost = quoteData.existing_concrete_paving_cost || 0;
  
  // Calculate total cost
  const totalCost = existingConcretePavingCost;
  
  return (
    <Card className="border border-gray-200 mt-8">
      <CardHeader 
        className="bg-white py-4 px-5 flex flex-row items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-medium">Summary</h3>
        </div>
        <div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="p-5">
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
              <h4 className="font-medium mb-3">Cost Breakdown</h4>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paving on Existing Concrete:</span>
                  <span className="font-medium">{formatCurrency(existingConcretePavingCost)}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                  <span>Total Cost:</span>
                  <span>{formatCurrency(totalCost)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};
