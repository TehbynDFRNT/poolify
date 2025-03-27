
import React from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface PavingTypeSelectorProps {
  selectedPavingId: string;
  extraPavingCosts?: ExtraPavingCost[];
  onSelect: (value: string) => void;
}

export const PavingTypeSelector = ({
  selectedPavingId,
  extraPavingCosts,
  onSelect
}: PavingTypeSelectorProps) => {
  return (
    <div>
      <Label htmlFor="paving-type" className="block text-gray-700 font-medium mb-1">
        Paving Type
      </Label>
      <Select
        value={selectedPavingId}
        onValueChange={onSelect}
      >
        <SelectTrigger id="paving-type" className="w-full">
          <SelectValue placeholder="Select paving type" />
        </SelectTrigger>
        <SelectContent>
          {extraPavingCosts?.map((paving) => (
            <SelectItem key={paving.id} value={paving.id}>
              {paving.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
