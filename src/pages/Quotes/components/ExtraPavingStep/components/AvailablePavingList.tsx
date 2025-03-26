
import { cn } from "@/lib/utils";
import { PavingSelection } from "../types";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface AvailablePavingListProps {
  selections: PavingSelection[];
  activeSelection: PavingSelection | null;
  onSelectPaving: (selection: PavingSelection) => void;
  extraPavingCosts?: ExtraPavingCost[];
  disabledIds?: string[];
}

export const AvailablePavingList = ({
  selections,
  activeSelection,
  onSelectPaving,
  extraPavingCosts = [],
  disabledIds = []
}: AvailablePavingListProps) => {
  if (!extraPavingCosts || extraPavingCosts.length === 0) {
    return (
      <div className="p-4 bg-gray-50 rounded-md text-center">
        <p className="text-gray-500">No paving types available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {extraPavingCosts.map((pavingCost) => {
        // Create a mock selection object for the paving cost
        const mockSelection: PavingSelection = {
          quoteId: '',
          pavingId: pavingCost.id,
          pavingCategory: pavingCost.category,
          paverCost: pavingCost.paver_cost,
          wastageCost: pavingCost.wastage_cost,
          marginCost: pavingCost.margin_cost,
          meters: 0,
          totalCost: 0
        };
        
        const isSelected = selections.some(s => s.pavingId === pavingCost.id);
        const isActive = activeSelection?.pavingId === pavingCost.id;
        const isDisabled = disabledIds.includes(pavingCost.id);
        
        return (
          <div 
            key={pavingCost.id}
            className={cn(
              "p-3 border rounded-md cursor-pointer flex justify-between",
              isActive 
                ? "border-primary bg-primary/5" 
                : isSelected
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 hover:border-gray-300",
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => !isDisabled && onSelectPaving(mockSelection)}
          >
            <div className="font-medium">{pavingCost.category}</div>
            <div className="font-semibold">${pavingCost.paver_cost.toFixed(2)}/m</div>
          </div>
        );
      })}
    </div>
  );
};
