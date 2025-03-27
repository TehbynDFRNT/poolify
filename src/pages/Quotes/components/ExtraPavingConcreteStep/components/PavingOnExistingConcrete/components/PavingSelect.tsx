
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface PavingSelectProps {
  selectedPavingId: string;
  pavingOptions: Array<{ id: string; category: string }>;
  onChange: (id: string) => void;
  disabled?: boolean;
}

export const PavingSelect: React.FC<PavingSelectProps> = ({
  selectedPavingId,
  pavingOptions,
  onChange,
  disabled = false
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="paving-type">Paving Type</Label>
      <Select
        value={selectedPavingId}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="paving-type" className="w-full">
          <SelectValue placeholder="Select paving type" />
        </SelectTrigger>
        <SelectContent>
          {pavingOptions.length === 0 ? (
            <SelectItem value="none" disabled>
              No paving options available
            </SelectItem>
          ) : (
            <>
              <SelectItem value="" disabled>
                Select paving type
              </SelectItem>
              {pavingOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.category}
                </SelectItem>
              ))}
            </>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};
