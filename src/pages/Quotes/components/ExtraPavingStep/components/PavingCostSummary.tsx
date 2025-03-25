
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { PavingSelection } from "../hooks/useExtraPavingQuote";

interface PavingCostSummaryProps {
  activeSelection: PavingSelection | null;
  onRemove: (pavingId: string) => void;
}

export const PavingCostSummary = ({ activeSelection, onRemove }: PavingCostSummaryProps) => {
  if (!activeSelection) return null;
  
  return (
    <div className="col-span-3">
      <div className="flex flex-col h-full">
        <div className="text-gray-700 font-medium">
          Cost per meter
        </div>
        <div className="mt-2 text-lg font-semibold">
          ${activeSelection ? ((activeSelection.totalCost || 0) / (activeSelection.meters || 1)).toFixed(2) : "0.00"}
        </div>
        <div className="mt-1 font-medium">
          Total Cost
        </div>
        <div className="text-lg font-semibold">
          ${activeSelection?.totalCost.toFixed(2) || "0.00"}
        </div>
        {activeSelection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(activeSelection.pavingId)}
            className="mt-2 text-red-500 hover:text-red-700 p-0 h-8 justify-start"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>
    </div>
  );
};
