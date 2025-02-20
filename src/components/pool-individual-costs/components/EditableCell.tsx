
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PoolIndividualCost } from "@/types/pool-individual-cost";
import { formatCurrency } from "@/utils/format";

interface EditableCellProps {
  cost: PoolIndividualCost;
  field: keyof PoolIndividualCost;
  value: any;
  isEditing: boolean;
  onValueChange: (value: any) => void;
}

export const EditableCell = ({
  cost,
  field,
  value,
  isEditing,
  onValueChange,
}: EditableCellProps) => {
  if (isEditing) {
    if (field === "range") {
      return (
        <Select 
          value={value || cost.range}
          onValueChange={onValueChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {["Uncategorized", "Range 1", "Range 2", "Range 3"].map((range) => (
              <SelectItem key={range} value={range}>
                {range}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        value={value ?? cost[field] ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
        type={field === "cost_value" ? "number" : "text"}
        className="w-full"
      />
    );
  }

  const displayValue = (() => {
    if (field === "cost_value") {
      return value ? formatCurrency(value) : "-";
    }
    return value || "-";
  })();

  return (
    <div className="cursor-pointer p-1 rounded">
      {displayValue}
    </div>
  );
};
