
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { PavingSelection } from "../types";
import { useState, useEffect } from "react";

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
  const [metersValue, setMetersValue] = useState<string>("");

  // Update local state when activeSelection changes
  useEffect(() => {
    if (activeSelection) {
      setMetersValue(activeSelection.meters.toString());
    } else {
      setMetersValue("");
    }
  }, [activeSelection]);

  const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Update the local state regardless
    setMetersValue(inputValue);
    
    // Only update the parent component if we have a valid value and an active selection
    if (activeSelection) {
      // Convert to number only when sending to parent
      const numericValue = inputValue === "" ? 0 : parseFloat(inputValue);
      if (!isNaN(numericValue)) {
        onUpdate(activeSelection.pavingId, numericValue);
      }
    }
  };

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
        <div className="mt-2">
          <input
            id="meters"
            type="text"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
            value={metersValue}
            placeholder="Enter meters"
            onChange={handleMetersChange}
            disabled={!activeSelection}
            inputMode="decimal"
          />
        </div>
      </div>
    </div>
  );
};
