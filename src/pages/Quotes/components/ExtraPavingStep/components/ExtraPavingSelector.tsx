
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PavingSelection } from "../hooks/useExtraPavingQuote";
import { PavingCategorySelector } from "./PavingCategorySelector";
import { PavingCostSummary } from "./PavingCostSummary";
import { CostBreakdown } from "./CostBreakdown";
import { AvailablePavingList } from "./AvailablePavingList";
import { PavingTotalSummary } from "./PavingTotalSummary";

interface ExtraPavingSelectorProps {
  quoteId?: string;
  selections: PavingSelection[];
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onRemove: (pavingId: string) => void;
}

export const ExtraPavingSelector = ({
  quoteId,
  selections,
  onAdd,
  onUpdate,
  onRemove
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
    }
  }, [selections, activeSelection]);

  const calculateTotalMargin = () => {
    if (!selections.length) return 0;
    return selections.reduce((sum, sel) => {
      const materialMargin = sel.marginCost * sel.meters;
      const laborMargin = 30 * sel.meters; 
      return sum + materialMargin + laborMargin;
    }, 0);
  };

  const calculateTotalCost = () => {
    if (!selections.length) return 0;
    return selections.reduce((sum, sel) => sum + sel.totalCost, 0);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-green-500 text-xl">⊞</span>
          <CardTitle className="text-lg font-medium">Extra Paving</CardTitle>
        </div>
        <PavingTotalSummary 
          totalMargin={calculateTotalMargin()}
          totalCost={calculateTotalCost()}
        />
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-12 gap-6">
          <PavingCategorySelector
            extraPavingCosts={extraPavingCosts}
            activeSelection={activeSelection}
            selections={selections}
            quoteId={quoteId}
            isLoading={isLoading}
            onAdd={onAdd}
            onUpdate={onUpdate}
          />
          
          <PavingCostSummary
            activeSelection={activeSelection}
            onRemove={onRemove}
          />
          
          {activeSelection && (
            <CostBreakdown activeSelection={activeSelection} />
          )}
        </div>
        
        <AvailablePavingList 
          selections={selections}
          activeSelection={activeSelection}
          onSelectPaving={setActiveSelection}
        />
      </CardContent>
    </Card>
  );
};
