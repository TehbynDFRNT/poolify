
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pool, POOL_RANGES } from "@/types/pool";
import { formatCurrency } from "@/utils/format";

interface EditableCellProps {
  pool: Pool;
  field: keyof Pool;
  value: any;
  isEditing: boolean;
  onValueChange: (value: any) => void;
}

export const EditableCell = ({
  pool,
  field,
  value,
  isEditing,
  onValueChange,
}: EditableCellProps) => {
  if (isEditing) {
    if (field === "range") {
      return (
        <Select 
          value={value || pool.range}
          onValueChange={onValueChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            {POOL_RANGES.map((range) => (
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
        value={value ?? pool[field] ?? ""}
        onChange={(e) => onValueChange(e.target.value)}
        type={field === "name" ? "text" : "number"}
        step={field.includes("length") || field.includes("width") || field.includes("depth") ? "0.01" : "1"}
        className="w-full"
      />
    );
  }

  const displayValue = (() => {
    if (field === "buy_price_ex_gst" || field === "buy_price_inc_gst") {
      return value ? formatCurrency(value) : "-";
    }
    if (typeof value === "number") {
      if (field.includes("length") || field.includes("width") || field.includes("depth")) {
        return `${value}m`;
      }
      if (field.includes("kg")) {
        return `${value}kg`;
      }
      if (field === "volume_liters") {
        return `${value}L`;
      }
      if (field === "waterline_l_m") {
        return `${value}L/m`;
      }
      return value;
    }
    return value || "-";
  })();

  return (
    <div className="cursor-pointer p-1 rounded">
      {displayValue}
    </div>
  );
};
