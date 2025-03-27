
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface PavingSelectProps {
  selectedPavingId: string;
  pavingOptions: ExtraPavingCost[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PavingSelect: React.FC<PavingSelectProps> = React.memo(({
  selectedPavingId,
  pavingOptions,
  onChange,
  disabled
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="paving-type">Paving Type</Label>
      <Select
        value={selectedPavingId}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="paving-type">
          <SelectValue placeholder="Select paving type" />
        </SelectTrigger>
        <SelectContent>
          {pavingOptions.map((paving) => (
            <SelectItem key={paving.id} value={paving.id}>
              {paving.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

PavingSelect.displayName = "PavingSelect";
