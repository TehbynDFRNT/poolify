
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { PavingSelection } from "../types";
import { useEffect } from "react";

interface PavingCategorySelectorProps {
  extraPavingCosts?: ExtraPavingCost[];
  activeSelection: PavingSelection | null;
  selections: PavingSelection[];
  quoteId?: string;
  isLoading: boolean;
  onAdd: (pavingId: string) => void;
  onUpdate: (pavingId: string, meters: number) => void;
  onSelectionChange?: (pavingId: string) => void;
}

export const PavingCategorySelector = ({
  extraPavingCosts,
  activeSelection,
  selections,
  quoteId,
  isLoading,
  onAdd,
  onUpdate,
  onSelectionChange
}: PavingCategorySelectorProps) => {
  // Log active selection change for debugging
  useEffect(() => {
    console.log("Active selection:", activeSelection);
  }, [activeSelection]);

  // Handler for when a value in the select dropdown changes
  const handleSelectChange = (value: string) => {
    if (!value) return;
    
    // Check if this paving type is already selected
    const existingSelection = selections.find(s => s.pavingId === value);
    
    if (existingSelection) {
      // If it exists, just switch to it
      if (onSelectionChange) {
        onSelectionChange(value);
      }
    } else {
      // If it doesn't exist, add it
      onAdd(value);
    }
  };

  const handleMetersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeSelection) return;
    
    // Get value from input
    const inputValue = e.target.value;
    
    // Convert to number (default to 0 if empty)
    let numericValue = 0;
    if (inputValue !== "") {
      numericValue = parseFloat(inputValue);
      if (isNaN(numericValue)) numericValue = 0;
    }
    
    // Update with the numeric value
    onUpdate(activeSelection.pavingId, numericValue);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label htmlFor="paving-category" className="text-gray-700 font-medium">
          Paving Category
        </Label>
        <Select
          value={activeSelection?.pavingId || ""}
          onValueChange={handleSelectChange}
          disabled={isLoading || !quoteId}
        >
          <SelectTrigger id="paving-category" className="mt-2">
            <SelectValue placeholder="Select paving type" />
          </SelectTrigger>
          <SelectContent>
            {selections.map((selection) => (
              <SelectItem key={selection.pavingId} value={selection.pavingId}>
                {selection.pavingCategory}
              </SelectItem>
            ))}
            {!selections.length && (
              <SelectItem value="none" disabled>
                No selections available
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
          type="number"
          step="0.1"
          min="0"
          className="mt-2"
          value={activeSelection?.meters ?? ""}
          placeholder="Enter meters"
          onChange={handleMetersChange}
          disabled={!activeSelection}
        />
      </div>
    </div>
  );
};
