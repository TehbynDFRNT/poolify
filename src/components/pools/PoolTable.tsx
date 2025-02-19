
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { EditableCell } from "./components/EditableCell";
import { toast } from "sonner";

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
    mutationFn: async ({ id, field, value }: { id: string; field: keyof Pool; value: any }) => {
      const updates = { [field]: value };
      
      const { error } = await supabase
        .from("pool_specifications")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool updated successfully");
      setEditingCell(null);
      setEditValue("");
    },
    onError: (error) => {
      console.error("Error updating pool:", error);
      toast.error("Failed to update pool");
    },
  });

  const handleCellClick = (pool: Pool, field: keyof Pool) => {
    if (!editableFields.includes(field)) return;
    
    setEditingCell({ id: pool.id, field });
    setEditValue(String(pool[field] || ""));
  };

  const handleCellBlur = (pool: Pool, field: keyof Pool) => {
    if (!editingCell) return;

    let value: string | number | null = editValue;

    // Convert value based on field type
    if (field === "range" || field === "name") {
      value = editValue;
    } else if (editValue === "") {
      value = null;
    } else {
      value = parseFloat(editValue);
      if (isNaN(value)) {
        toast.error("Please enter a valid number");
        return;
      }
    }

    updatePoolMutation.mutate({ id: pool.id, field, value });
  };

  const handleKeyDown = (e: React.KeyboardEvent, pool: Pool, field: keyof Pool) => {
    if (e.key === "Enter") {
      handleCellBlur(pool, field);
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {editableFields.map((field) => (
              <TableHead key={field}>{field}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => (
            <TableRow key={pool.id}>
              {editableFields.map((field) => (
                <TableCell key={field} onClick={() => handleCellClick(pool, field)}>
                  <EditableCell
                    pool={pool}
                    field={field}
                    value={pool[field]}
                    isEditing={editingCell?.id === pool.id && editingCell?.field === field}
                    editValue={editValue}
                    onValueChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => handleCellBlur(pool, field)}
                    onKeyDown={(e) => handleKeyDown(e, pool, field)}
                    onRangeChange={(value) => {
                      updatePoolMutation.mutate({
                        id: pool.id,
                        field: 'range',
                        value,
                      });
                    }}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
