
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PavingSelection } from "../types";
import { CostBreakdown } from "./CostBreakdown";
import { PavingCategorySelector } from "./PavingCategorySelector";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExtraPavingSelectorProps {
  quoteId?: string;
  selections: PavingSelection[];
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onRemove: (pavingId: string) => void;
  totalCost: number;
  totalMargin: number;
}

export const ExtraPavingSelector = ({
  quoteId,
  selections,
  onAdd,
  onUpdate,
  onRemove,
  totalCost,
  totalMargin
}: ExtraPavingSelectorProps) => {
  const { extraPavingCosts, isLoading } = useExtraPavingCosts();
  const [activeSelection, setActiveSelection] = useState<PavingSelection | null>(null);

  useEffect(() => {
    // Set active selection to the first one if available and none selected
    if (selections.length > 0 && !activeSelection) {
      setActiveSelection(selections[0]);
    } else if (selections.length === 0) {
      setActiveSelection(null);
    } else if (activeSelection && !selections.find(s => s.pavingId === activeSelection.pavingId)) {
      // If active selection was removed, set to first available one
      setActiveSelection(selections[0]);
    } else if (activeSelection) {
      // Update active selection with latest data from selections
      const updatedSelection = selections.find(s => s.pavingId === activeSelection.pavingId);
      if (updatedSelection && updatedSelection.meters !== activeSelection.meters) {
        setActiveSelection(updatedSelection);
      }
    }
  }, [selections, activeSelection]);

  // Calculate total meters
  const totalMeters = selections.reduce((total, selection) => total + selection.meters, 0);

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
                    ${activeSelection.meters > 0 
                        ? (activeSelection.totalCost / activeSelection.meters).toFixed(2) 
                        : "0.00"}
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
            <CostBreakdown activeSelection={activeSelection} />
          )}
          
          {selections.length > 0 && (
            <div className="bg-slate-50 p-4 rounded-md">
              <h4 className="font-medium text-gray-700 mb-2">Total Summary</h4>
              <div className="grid grid-cols-2">
                <div>Cost Per Meter:</div>
                <div className="text-right">
                  ${totalMeters > 0 
                      ? (totalCost / totalMeters).toFixed(2) 
                      : "0.00"}
                </div>
                
                <div>Total Meters:</div>
                <div className="text-right">{totalMeters.toFixed(2)}</div>
                
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
