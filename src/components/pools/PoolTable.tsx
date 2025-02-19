import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow, TableHead, TableHeader } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool, POOL_RANGES } from "@/types/pool";
import { formatCurrency } from "@/utils/format";

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

  const isStringField = (field: keyof Pool): boolean => {
    return ["name", "range"].includes(field);
  };

  const calculateFiltrationTotal = (pkg: any) => {
    if (!pkg) return 0;
    
    const handoverKitTotal = pkg.handover_kit?.components.reduce((total: number, comp: any) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (pkg.filter?.price || 0) +
      handoverKitTotal
    );
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
                  <TableCell key={field}>{renderCell(pool, field)}</TableCell>
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
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={editableFields.length + 1}>
                    <div className="p-2 text-sm space-y-2">
                      <div className="grid grid-cols-5 gap-4">
                        <div>
                          <span className="font-medium">Light</span>
                          <div className="mt-1 text-muted-foreground">
                            {pool.standard_filtration_package.light?.model_number || 'None'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Pool Pump</span>
                          <div className="mt-1 text-muted-foreground">
                            {pool.standard_filtration_package.pump?.model_number || 'None'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Sanitiser</span>
                          <div className="mt-1 text-muted-foreground">
                            {pool.standard_filtration_package.sanitiser?.model_number || 'None'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Filter</span>
                          <div className="mt-1 text-muted-foreground">
                            {pool.standard_filtration_package.filter?.model_number || 'None'}
                          </div>
                        </div>
                        <div>
                          <span className="font-medium">Handover Kit</span>
                          <div className="mt-1 text-muted-foreground">
                            {pool.standard_filtration_package.handover_kit?.name || 'None'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
