
import React from "react";
import { Label } from "@/components/ui/label";
import { SelectContent, SelectItem, SelectTrigger, SelectValue, Select } from "@/components/ui/select";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface PavingTypeSelectorProps {
  selectedPavingId: string;
  pavingOptions: ExtraPavingCost[] | undefined;
  onSelect: (value: string) => void;
}

export const PavingTypeSelector = ({ 
  selectedPavingId, 
  pavingOptions, 
  onSelect 
}: PavingTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="paving-type" className="block text-gray-700 font-medium mb-1">
        Paving Type
      </Label>
      <Select value={selectedPavingId} onValueChange={onSelect}>
        <SelectTrigger id="paving-type" className="w-full">
          <SelectValue placeholder="Select paving type" />
        </SelectTrigger>
        <SelectContent>
          {pavingOptions?.map((pavingType) => (
            <SelectItem key={pavingType.id} value={pavingType.id}>
              {pavingType.category}
            </SelectItem>
          ))}
          {!pavingOptions?.length && (
            <SelectItem value="none" disabled>
              No paving types available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
