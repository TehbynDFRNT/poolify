
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PavingSelection } from "../types";
import { CostBreakdown } from "./CostBreakdown";
import { PavingCategorySelector } from "./PavingCategorySelector";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ConcreteLabourCost } from "@/types/concrete-labour-cost";

interface ExtraPavingSelectorProps {
  quoteId?: string;
  selections: PavingSelection[];
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onRemove: (pavingId: string) => void;
  totalCost: number;
  totalMargin: number;
  concreteLabourCosts?: ConcreteLabourCost[];
}

export const ExtraPavingSelector = ({
  quoteId,
  selections,
  onAdd,
  onUpdate,
  onRemove,
  totalCost,
  totalMargin,
  concreteLabourCosts = []
}: ExtraPavingSelectorProps) => {
  const { extraPavingCosts, isLoading } = useExtraPavingCosts();
  const [activeSelection, setActiveSelection] = useState<PavingSelection | null>(null);

  // For debugging
  useEffect(() => {
    console.log("All selections:", selections);
    console.log("Total meters:", getTotalMeters());
    console.log("Concrete labour costs:", concreteLabourCosts);
    
    // Log each selection's details
    selections.forEach(s => {
      console.log(`Selection ${s.pavingCategory}: ${s.meters} meters, total cost: ${s.totalCost}`);
    });
  }, [selections, concreteLabourCosts]);

  // Set active selection when selections change
  useEffect(() => {
    if (selections.length > 0) {
      const current = activeSelection 
        ? selections.find(s => s.pavingId === activeSelection.pavingId) 
        : null;
      
      if (current) {
        // Update the active selection if it still exists
        setActiveSelection(current);
      } else {
        // Otherwise set to the first selection
        setActiveSelection(selections[0]);
      }
    } else {
      setActiveSelection(null);
    }
  }, [selections]);

  // Manually change the active selection
  const handleSelectionChange = (pavingId: string) => {
    const selection = selections.find(s => s.pavingId === pavingId);
    if (selection) {
      setActiveSelection(selection);
    }
  };

  // Calculate cost per meter for the active selection
  const getCostPerMeter = () => {
    if (!activeSelection) return 0;
    
    // Material costs
    const materialCostPerMeter = activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost;
    
    // Labour costs from database
    const laborCostPerMeter = concreteLabourCosts.reduce((total, cost) => {
      return total + cost.cost + cost.margin;
    }, 0);
    
    return materialCostPerMeter + laborCostPerMeter;
  };

  // Calculate total meters across all selections
  const getTotalMeters = () => {
    return selections.reduce((sum, selection) => {
      const meters = selection.meters === undefined || isNaN(selection.meters) ? 0 : selection.meters;
      return sum + meters;
    }, 0);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-xl">⊞</span>
          <h3 className="text-lg font-medium">Extra Paving</h3>
        </div>
        <div className="text-right">
          <div className="text-sm text-green-600 font-medium">
            Total Margin: ${totalMargin.toFixed(2)}
          </div>
          <div className="text-xl font-semibold">
            Total: ${totalCost.toFixed(2)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-1 gap-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-7">
              <PavingCategorySelector
                extraPavingCosts={extraPavingCosts}
                activeSelection={activeSelection}
                selections={selections}
                quoteId={quoteId}
                isLoading={isLoading}
                onAdd={onAdd}
                onUpdate={onUpdate}
                onSelectionChange={handleSelectionChange}
              />
            </div>
            
            <div className="col-span-5">
              {activeSelection && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Cost per meter</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemove(activeSelection.pavingId)}
                      className="text-red-500 hover:text-red-700 p-0 h-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-lg font-semibold">
                    ${getCostPerMeter().toFixed(2)}
                  </div>
                  <div className="mt-1 font-medium">
                    Total Cost
                  </div>
                  <div className="text-lg font-semibold">
                    ${activeSelection.totalCost.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {activeSelection && (
            <CostBreakdown 
              activeSelection={activeSelection} 
              concreteLabourCosts={concreteLabourCosts}
            />
          )}
          
          {selections.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Total Summary</h4>
              <div className="grid grid-cols-2">
                <div>Cost Per Meter:</div>
                <div className="text-right">${getTotalMeters() > 0 ? (totalCost / getTotalMeters()).toFixed(2) : "0.00"}</div>
                
                <div>Total Meters:</div>
                <div className="text-right">{getTotalMeters().toFixed(1)}</div>
                
                <div>Total Margin:</div>
                <div className="text-right text-green-600">${totalMargin.toFixed(2)}</div>
                
                <div className="font-medium">Total Cost:</div>
                <div className="text-right font-medium">${totalCost.toFixed(2)}</div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
