
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { Edit2 } from "lucide-react";
import { toast } from "sonner";
import type { Pool } from "@/types/pool";
import { POOL_RANGES } from "@/types/pool";
import { useState } from "react";

interface PoolTableProps {
  pools: Pool[];
}

interface EditingCell {
  id: string;
  field: keyof Pool;
}

const PoolTable = ({ pools }: PoolTableProps) => {
  const queryClient = useQueryClient();
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const updatePoolMutation = useMutation({
    mutationFn: async (pool: Partial<Pool> & { id: string }) => {
      if (pool.buy_price_ex_gst !== undefined) {
        pool.buy_price_inc_gst = pool.buy_price_ex_gst * 1.1;
      }
      const { error } = await supabase
        .from("pool_specifications")
        .update(pool)
        .eq("id", pool.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool specification updated successfully");
      setEditingCell(null);
      setEditValue("");
    },
    onError: (error) => {
      toast.error("Failed to update pool specification");
      console.error(error);
    },
  });

  const handleCellClick = (pool: Pool, field: keyof Pool) => {
    if (field === "buy_price_inc_gst") return; // Don't allow editing of GST-inclusive price
    setEditingCell({ id: pool.id, field });
    setEditValue(String(pool[field] || ""));
  };

  const handleCellBlur = (pool: Pool) => {
    if (!editingCell) return;

    const value = editValue.trim();
    if (value === String(pool[editingCell.field])) {
      setEditingCell(null);
      setEditValue("");
      return;
    }

    let parsedValue: string | number | null = value;
    if (editingCell.field !== "name" && editingCell.field !== "range") {
      parsedValue = value === "" ? null : Number(value);
      if (typeof parsedValue === "number" && isNaN(parsedValue)) {
        toast.error("Please enter a valid number");
        return;
      }
    }

    updatePoolMutation.mutate({
      id: pool.id,
      [editingCell.field]: parsedValue,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, pool: Pool) => {
    if (e.key === "Enter") {
      handleCellBlur(pool);
    } else if (e.key === "Escape") {
      setEditingCell(null);
      setEditValue("");
    }
  };

  const renderCell = (pool: Pool, field: keyof Pool) => {
    const isEditing = editingCell?.id === pool.id && editingCell?.field === field;
    const value = pool[field];

    if (isEditing) {
      if (field === "range") {
        return (
          <Select
            value={editValue}
            onValueChange={(value) => {
              setEditValue(value);
              updatePoolMutation.mutate({ id: pool.id, [field]: value });
            }}
          >
            <SelectTrigger>
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
          type={field === "name" || field === "range" ? "text" : "number"}
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
        {displayValue}
      </div>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Range</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Length</TableHead>
            <TableHead>Width</TableHead>
            <TableHead>Shallow End</TableHead>
            <TableHead>Deep End</TableHead>
            <TableHead>Waterline L/M</TableHead>
            <TableHead>Water Volume (L)</TableHead>
            <TableHead>Salt Bags</TableHead>
            <TableHead>Salt Fixed</TableHead>
            <TableHead>Weight (KG)</TableHead>
            <TableHead>Minerals Initial</TableHead>
            <TableHead>Minerals Topup</TableHead>
            <TableHead>Buy Price (ex GST)</TableHead>
            <TableHead>Buy Price (inc GST)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools?.map((pool) => (
            <TableRow key={pool.id}>
              <TableCell>{renderCell(pool, "range")}</TableCell>
              <TableCell>{renderCell(pool, "name")}</TableCell>
              <TableCell>{renderCell(pool, "length")}</TableCell>
              <TableCell>{renderCell(pool, "width")}</TableCell>
              <TableCell>{renderCell(pool, "depth_shallow")}</TableCell>
              <TableCell>{renderCell(pool, "depth_deep")}</TableCell>
              <TableCell>{renderCell(pool, "waterline_l_m")}</TableCell>
              <TableCell>{renderCell(pool, "volume_liters")}</TableCell>
              <TableCell>{renderCell(pool, "salt_volume_bags")}</TableCell>
              <TableCell>{renderCell(pool, "salt_volume_bags_fixed")}</TableCell>
              <TableCell>{renderCell(pool, "weight_kg")}</TableCell>
              <TableCell>{renderCell(pool, "minerals_kg_initial")}</TableCell>
              <TableCell>{renderCell(pool, "minerals_kg_topup")}</TableCell>
              <TableCell>{renderCell(pool, "buy_price_ex_gst")}</TableCell>
              <TableCell>{renderCell(pool, "buy_price_inc_gst")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PoolTable;
