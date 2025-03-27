
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExtraPavingCost } from "@/types/extra-paving-cost";

interface PavingSelectProps {
  selectedPavingId: string;
  pavingOptions: ExtraPavingCost[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

export const PavingSelect: React.FC<PavingSelectProps> = ({
  selectedPavingId,
  pavingOptions,
  onChange,
  disabled
}) => {
  // Group paving options by category
  const groupedOptions = pavingOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, ExtraPavingCost[]>);

  return (
    <div>
      <Label htmlFor="paving-type" className="block text-gray-700 font-medium mb-1">
        Paving Type
      </Label>
      <Select
        value={selectedPavingId}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger id="paving-type" className="w-full">
          <SelectValue placeholder="Select paving type" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(groupedOptions).map(([category, options]) => (
            <SelectGroup key={category}>
              <SelectItem value={`category-${category}`} disabled>
                {category}
              </SelectItem>
              {options.map(option => (
                <SelectItem key={option.id} value={option.id}>
                  {category} - {option.paver_cost + option.wastage_cost + option.margin_cost}/m²
                </SelectItem>
              ))}
            </SelectGroup>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
