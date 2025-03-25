
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { PavingSelection } from "../hooks/useExtraPavingQuote";

interface PavingCategorySelectorProps {
  extraPavingCosts?: ExtraPavingCost[];
  activeSelection: PavingSelection | null;
  selections: PavingSelection[];
  quoteId?: string;
  isLoading: boolean;
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
}

export const PavingCategorySelector = ({
  extraPavingCosts,
  activeSelection,
  selections,
  quoteId,
  isLoading,
  onAdd,
  onUpdate
}: PavingCategorySelectorProps) => {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-5">
        <Label htmlFor="paving-category" className="text-gray-700 font-medium">
          Paving Category
        </Label>
        <Select
          value={activeSelection?.pavingId || ""}
          onValueChange={(value) => {
            if (value && !selections.find(s => s.pavingId === value)) {
              onAdd(value);
            } else {
              // Setting active selection is handled in the parent component
            }
          }}
          disabled={isLoading || !quoteId}
        >
          <SelectTrigger id="paving-category" className="mt-2">
            <SelectValue placeholder="Select paving type" />
          </SelectTrigger>
          <SelectContent>
            {extraPavingCosts?.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.category}
              </SelectItem>
            ))}
            {!extraPavingCosts?.length && (
              <SelectItem value="none" disabled>
                No paving types available
              </SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>
      
      <div className="col-span-4">
        <Label htmlFor="meters" className="text-gray-700 font-medium">
          Meters
        </Label>
        <Input
          id="meters"
          type="number"
          className="mt-2"
          min="0"
          step="0.5"
          value={activeSelection?.meters || 0}
          onChange={(e) => {
            if (activeSelection) {
              onUpdate(activeSelection.pavingId, parseFloat(e.target.value) || 0);
            }
          }}
          disabled={!activeSelection}
        />
      </div>
    </div>
  );
};
