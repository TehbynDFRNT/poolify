
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { EditableCell } from "./components/EditableCell";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

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

interface PoolTableProps {
  pools: Pool[];
}

// Define which fields can be null
type NullableNumericFields = 
  | "waterline_l_m"
  | "volume_liters"
  | "salt_volume_bags"
  | "salt_volume_bags_fixed"
  | "weight_kg"
  | "minerals_kg_initial"
  | "minerals_kg_topup"
  | "buy_price_ex_gst"
  | "buy_price_inc_gst";

type PoolUpdates = {
  [K in keyof Pool]?: K extends NullableNumericFields 
    ? number | null 
    : K extends "name" | "range" 
      ? string 
      : number;
}

export const PoolTable = ({ pools }: PoolTableProps) => {
  const [editingRows, setEditingRows] = useState<Record<string, Partial<Pool>>>({});
  const queryClient = useQueryClient();

  const updatePoolMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PoolUpdates }) => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool updated successfully");
      setEditingRows((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (error) => {
      console.error("Error updating pool:", error);
      toast.error("Failed to update pool");
    },
  });

  const handleValueChange = (pool: Pool, field: keyof Pool, value: any) => {
    setEditingRows((prev) => ({
      ...prev,
      [pool.id]: {
        ...prev[pool.id],
        [field]: value
      }
    }));
  };

  const handleSaveRow = (pool: Pool) => {
    const updates = editingRows[pool.id];
    if (!updates) return;

    const validatedUpdates: PoolUpdates = {};

    for (const [key, value] of Object.entries(updates)) {
      const field = key as keyof Pool;
      
      if (field === "name" || field === "range") {
        validatedUpdates[field] = value as string;
        continue;
      }

      if (value === "" || value === null) {
        // Only assign null to nullable fields
        if (field in ["waterline_l_m", "volume_liters", "salt_volume_bags", 
            "salt_volume_bags_fixed", "weight_kg", "minerals_kg_initial", 
            "minerals_kg_topup", "buy_price_ex_gst", "buy_price_inc_gst"]) {
          validatedUpdates[field as NullableNumericFields] = null;
        }
        continue;
      }

      const numValue = parseFloat(value as string);
      if (isNaN(numValue)) {
        toast.error(`Invalid number for ${field}`);
        return;
      }
      validatedUpdates[field] = numValue;
    }

    updatePoolMutation.mutate({ 
      id: pool.id, 
      updates: validatedUpdates 
    });
  };

  const handleCancelRow = (poolId: string) => {
    setEditingRows((prev) => {
      const next = { ...prev };
      delete next[poolId];
      return next;
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {editableFields.map((field) => (
              <TableHead key={field}>{field}</TableHead>
            ))}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => {
            const isEditing = !!editingRows[pool.id];
            return (
              <TableRow key={pool.id}>
                {editableFields.map((field) => (
                  <TableCell key={field}>
                    <EditableCell
                      pool={pool}
                      field={field}
                      value={editingRows[pool.id]?.[field] ?? pool[field]}
                      isEditing={isEditing}
                      onValueChange={(value) => handleValueChange(pool, field, value)}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSaveRow(pool)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleCancelRow(pool.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingRows((prev) => ({
                        ...prev,
                        [pool.id]: {}
                      }))}
                    >
                      Edit
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
