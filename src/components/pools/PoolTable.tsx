
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool, POOL_RANGES } from "@/types/pool";
import { formatCurrency } from "@/utils/format";

// Define editableFields outside the component
const editableFields: (keyof Pool)[] = [
  "name",
  "range",
  "length",
  "width",
  "depth_shallow",
  "depth_deep",
  "waterline_l_m",
  "volume_liters",
  "salt_volume_bags",
  "salt_volume_bags_fixed",
  "weight_kg",
  "minerals_kg_initial",
  "minerals_kg_topup",
  "buy_price_ex_gst",
  "buy_price_inc_gst"
];

type EditingCell = {
  id: string;
  field: keyof Pool;
};

interface PoolTableProps {
  pools: Pool[];
}

export const PoolTable = ({ pools }: PoolTableProps) => {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const queryClient = useQueryClient();

  const updatePoolMutation = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Pool> & { id: string }) => {
      const { error } = await supabase
        .from("pool_specifications")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      setEditingCell(null);
    },
  });

  const handleCellClick = (pool: Pool, field: keyof Pool) => {
    if (!editableFields.includes(field)) return;
    
    setEditingCell({ id: pool.id, field });
    setEditValue(String(pool[field] || ""));
  };

  const handleCellBlur = (pool: Pool) => {
    if (!editingCell) return;

    const updates: Partial<Pool> & { id: string } = {
      id: pool.id,
      [editingCell.field]: editValue,
    };

    updatePoolMutation.mutate(updates);
  };

  const handleKeyDown = (e: React.KeyboardEvent, pool: Pool) => {
    if (e.key === "Enter") {
      handleCellBlur(pool);
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const isStringField = (field: keyof Pool): boolean => {
    return ["name", "range"].includes(field);
  };

  const renderCell = (pool: Pool, field: keyof Pool) => {
    const isEditing = editingCell?.id === pool.id && editingCell?.field === field;
    const value = pool[field];

    // Skip rendering for non-primitive fields
    if (typeof value === 'object') {
      return null;
    }

    if (isEditing) {
      if (field === "range") {
        return (
          <Select
            value={pool.range}
            onValueChange={(value) => {
              updatePoolMutation.mutate({
                id: pool.id,
                range: value,
              });
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
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => handleCellBlur(pool)}
          onKeyDown={(e) => handleKeyDown(e, pool)}
          type={isStringField(field) ? "text" : "number"}
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
      <div
        className="cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={() => handleCellClick(pool, field)}
      >
        {String(displayValue)}
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableBody>
          {pools.map((pool) => (
            <TableRow key={pool.id}>
              {editableFields.map((field) => (
                <TableCell key={field}>{renderCell(pool, field)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
