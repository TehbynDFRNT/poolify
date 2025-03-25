
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PavingSelection } from "../hooks/useExtraPavingQuote";

interface CostBreakdownProps {
  activeSelection: PavingSelection;
}

export const CostBreakdown = ({ activeSelection }: CostBreakdownProps) => {
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  if (!activeSelection) return null;

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className="ml-1 h-6 w-6 p-0"
        onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
      >
        {isBreakdownOpen ? 
          <ChevronUp className="h-4 w-4" /> : 
          <ChevronDown className="h-4 w-4" />
        }
      </Button>

      {isBreakdownOpen && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-4">Cost Breakdown</h3>
          
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-gray-700 font-medium mb-3">Materials (per meter)</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Paver Cost:</span>
                  <span>${activeSelection.paverCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Wastage Cost:</span>
                  <span>${activeSelection.wastageCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Material Margin:</span>
                  <span className="text-green-600">${activeSelection.marginCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Material Cost (per m):</span>
                  <span>${(activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Total Materials Cost:</span>
                  <span>${((activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost) * activeSelection.meters).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-gray-700 font-medium mb-3">Labour (per meter)</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Labour Cost:</span>
                  <span>$100.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Labour Margin:</span>
                  <span className="text-green-600">$30.00</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total Labour Cost (per m):</span>
                  <span>$130.00</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-2">
                  <span>Total Labour Cost:</span>
                  <span>${(130 * activeSelection.meters).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-100 p-4 rounded-md">
            <h4 className="text-gray-700 font-medium mb-3">Total Summary</h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex justify-between">
                <span>Cost Per Meter:</span>
                <span className="font-semibold">${((activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost) + 130).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Meters:</span>
                <span className="font-semibold">{activeSelection.meters}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Margin:</span>
                <span className="font-semibold text-green-600">${((activeSelection.marginCost + 30) * activeSelection.meters).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Cost:</span>
                <span className="font-semibold">${activeSelection.totalCost.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
