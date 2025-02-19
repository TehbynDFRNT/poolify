
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
  editValue: string;
  onValueChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onRangeChange: (value: string) => void;
}

export const EditableCell = ({
  pool,
  field,
  value,
  isEditing,
  editValue,
  onValueChange,
  onBlur,
  onKeyDown,
  onRangeChange,
}: EditableCellProps) => {
  if (isEditing) {
    if (field === "range") {
      return (
        <Select 
          value={pool.range} 
          onValueChange={onRangeChange}
          onOpenChange={(open) => {
            if (!open) {
              onBlur();
            }
          }}
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
        autoFocus
        value={editValue}
        onChange={onValueChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
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
    <div className="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors">
      {displayValue}
    </div>
  );
};
