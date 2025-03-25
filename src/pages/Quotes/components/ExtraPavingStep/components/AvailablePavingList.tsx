
import { cn } from "@/lib/utils";
import { PavingSelection } from "../hooks/useExtraPavingQuote";

interface AvailablePavingListProps {
  selections: PavingSelection[];
  activeSelection: PavingSelection | null;
  onSelectPaving: (selection: PavingSelection) => void;
}

export const AvailablePavingList = ({
  selections,
  activeSelection,
  onSelectPaving
}: AvailablePavingListProps) => {
  if (selections.length <= 1) return null;

  return (
    <div className="mt-6">
      <h3 className="font-medium mb-2">Available Paving Categories</h3>
      <div className="grid grid-cols-1 gap-2">
        {selections.map((selection) => (
          <div 
            key={selection.pavingId}
            className={cn(
              "p-3 border rounded-md cursor-pointer flex justify-between",
              activeSelection?.pavingId === selection.pavingId 
                ? "border-primary bg-primary/5" 
                : "border-gray-200 hover:border-gray-300"
            )}
            onClick={() => onSelectPaving(selection)}
          >
            <div className="font-medium">{selection.pavingCategory}</div>
            <div className="font-semibold">${selection.totalCost.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
