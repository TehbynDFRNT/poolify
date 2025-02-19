
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { EditableCell } from "./components/EditableCell";
import { FiltrationPackageDetails } from "./components/FiltrationPackageDetails";
import { calculateFiltrationTotal } from "./utils/filtrationCalculations";

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
  pools: any[]; // Using any temporarily to handle the extended pool data
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {editableFields.map((field) => (
              <TableHead key={field}>{field}</TableHead>
            ))}
            <TableHead>Filtration Package</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools.map((pool) => (
            <React.Fragment key={pool.id}>
              <TableRow>
                {editableFields.map((field) => (
                  <TableCell key={field} onClick={() => handleCellClick(pool, field)}>
                    <EditableCell
                      pool={pool}
                      field={field}
                      value={pool[field]}
                      isEditing={editingCell?.id === pool.id && editingCell?.field === field}
                      editValue={editValue}
                      onValueChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleCellBlur(pool)}
                      onKeyDown={(e) => handleKeyDown(e, pool)}
                      onRangeChange={(value) => {
                        updatePoolMutation.mutate({
                          id: pool.id,
                          range: value,
                        });
                      }}
                    />
                  </TableCell>
                ))}
                <TableCell>
                  {pool.standard_filtration_package ? (
                    <div className="space-y-2">
                      <div className="font-medium">
                        Option {pool.standard_filtration_package.display_order}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total: {formatCurrency(calculateFiltrationTotal(pool.standard_filtration_package))}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">No package selected</span>
                  )}
                </TableCell>
              </TableRow>
              {pool.standard_filtration_package && (
                <FiltrationPackageDetails 
                  package={pool.standard_filtration_package}
                  colSpan={editableFields.length + 1}
                />
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
