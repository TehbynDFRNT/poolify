
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PavingSelection } from "../types";
import { PavingCategorySelector } from "./PavingCategorySelector";
import { AvailablePavingList } from "./AvailablePavingList";
import { PavingCostSummary } from "./PavingCostSummary";
import { PavingTotalSummary } from "./PavingTotalSummary";
import { useState } from "react";
import { CostBreakdown } from "./CostBreakdown";
import type { ConcreteLabourCost } from "@/types/concrete-labour-cost";
import type { ConcreteCost } from "@/types/concrete-cost";

interface ExtraPavingSelector {
  quoteId?: string;
  selections: PavingSelection[];
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onRemove: (pavingId: string) => void;
  totalCost: number;
  totalMargin: number;
  concreteLabourCosts: ConcreteLabourCost[];
  concreteCosts?: ConcreteCost[];
}

export const ExtraPavingSelector = ({ 
  quoteId, 
  selections, 
  onAdd, 
  onUpdate, 
  onRemove, 
  totalCost,
  totalMargin,
  concreteLabourCosts,
  concreteCosts = []
}: ExtraPavingSelector) => {
  const [activeSelection, setActiveSelection] = useState<PavingSelection | null>(
    selections.length > 0 ? selections[0] : null
  );

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white pb-2">
        <h2 className="text-xl font-semibold">Extra Paving</h2>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-medium mb-4">Selected Paving Types</h3>
            
            {selections.length > 0 ? (
              <>
                <PavingCategorySelector 
                  selections={selections}
                  activeSelectionId={activeSelection?.pavingId}
                  onSelect={(id) => {
                    const selection = selections.find(s => s.pavingId === id);
                    if (selection) setActiveSelection(selection);
                  }}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                />
                
                <div className="mt-6">
                  <PavingTotalSummary totalCost={totalCost} totalMargin={totalMargin} />
                </div>
              </>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-md">
                <p className="text-gray-500">No paving types selected yet.</p>
                <p className="text-gray-500 text-sm mt-1">
                  Choose a paving type from the right panel to get started.
                </p>
              </div>
            )}
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Available Paving Types</h3>
              <AvailablePavingList 
                onAdd={onAdd}
                disabledIds={selections.map(s => s.pavingId)}
              />
            </div>
            
            {activeSelection && (
              <div className="mb-4">
                <CostBreakdown 
                  activeSelection={activeSelection} 
                  concreteLabourCosts={concreteLabourCosts}
                  concreteCosts={concreteCosts}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
