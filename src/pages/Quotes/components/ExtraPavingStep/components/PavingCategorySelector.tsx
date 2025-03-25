
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { PavingSelection } from "../types";

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
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="paving-category" className="text-gray-700 font-medium">
          Paving Category
        </Label>
        <Select
          value={activeSelection?.pavingId || ""}
          onValueChange={(value) => {
            if (value && !selections.find(s => s.pavingId === value)) {
              onAdd(value);
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
      
      <div>
        <Label htmlFor="meters" className="text-gray-700 font-medium">
          Meters
        </Label>
        <Input
          id="meters"
          type="text"
          inputMode="decimal"
          className="mt-2"
          value={activeSelection?.meters?.toString() || ""}
          placeholder="Enter meters"
          onChange={(e) => {
            if (activeSelection) {
              const inputValue = e.target.value;
              // Allow empty input, decimal points, and numbers
              if (inputValue === "" || /^[0-9]*\.?[0-9]*$/.test(inputValue)) {
                const value = inputValue === "" ? 0 : parseFloat(inputValue);
                onUpdate(activeSelection.pavingId, value);
              }
            }
          }}
          disabled={!activeSelection}
        />
      </div>
    </div>
  );
};
