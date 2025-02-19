
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
  const isStringField = ["name", "range"].includes(field);

  if (isEditing) {
    if (field === "range") {
      return (
        <Select value={pool.range} onValueChange={onRangeChange}>
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
        type={isStringField ? "text" : "number"}
        step={field === "length" || field === "width" || field === "depth_shallow" || field === "depth_deep" ? "0.01" : undefined}
      />
    );
  }

  const displayValue = (() => {
    if (field === "buy_price_ex_gst" || field === "buy_price_inc_gst") {
      return formatCurrency(value as number || 0);
    }
    if (field === "minerals_kg_initial" || field === "minerals_kg_topup") {
      return value || "-";
    }
    if (typeof value === "number") {
      return field.includes("length") || field.includes("width") || field.includes("depth") 
        ? `${value}m` 
        : value;
    }
    return value || "-";
  })();

  return (
    <div className="cursor-pointer hover:bg-gray-100 p-1 rounded">
      {String(displayValue)}
    </div>
  );
};
