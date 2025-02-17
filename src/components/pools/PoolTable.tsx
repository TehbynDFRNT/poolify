
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
import { Edit2, Save, X } from "lucide-react";
import { toast } from "sonner";
import type { Pool } from "@/types/pool";
import { POOL_RANGES } from "@/types/pool";
import { useState } from "react";

interface PoolTableProps {
  pools: Pool[];
}

const PoolTable = ({ pools }: PoolTableProps) => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingPool, setEditingPool] = useState<Pool | null>(null);

  const updatePoolMutation = useMutation({
    mutationFn: async (pool: Pool) => {
      const poolWithGST = {
        ...pool,
        buy_price_inc_gst: pool.buy_price_ex_gst ? pool.buy_price_ex_gst * 1.1 : null,
      };
      const { error } = await supabase
        .from("pool_specifications")
        .update(poolWithGST)
        .eq("id", pool.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool specification updated successfully");
      setEditingId(null);
      setEditingPool(null);
    },
    onError: (error) => {
      toast.error("Failed to update pool specification");
      console.error(error);
    },
  });

  const handleEdit = (pool: Pool) => {
    setEditingId(pool.id);
    setEditingPool(pool);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingPool(null);
  };

  const handleSaveEdit = (pool: Pool) => {
    updatePoolMutation.mutate(pool);
  };

  const handleEditChange = (field: keyof Pool, value: string | number | null) => {
    if (editingPool) {
      setEditingPool({ ...editingPool, [field]: value });
    }
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
            <TableHead>Minerals Initial/Topup</TableHead>
            <TableHead>Buy Price (ex GST)</TableHead>
            <TableHead>Buy Price (inc GST)</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pools?.map((pool) => (
            <TableRow key={pool.id}>
              {editingId === pool.id ? (
                <>
                  <TableCell>
                    <Select
                      value={editingPool?.range}
                      onValueChange={(value) => handleEditChange("range", value)}
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
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editingPool?.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingPool?.length}
                      onChange={(e) => handleEditChange("length", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingPool?.width}
                      onChange={(e) => handleEditChange("width", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingPool?.depth_shallow}
                      onChange={(e) => handleEditChange("depth_shallow", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingPool?.depth_deep}
                      onChange={(e) => handleEditChange("depth_deep", Number(e.target.value))}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.1"
                      value={editingPool?.waterline_l_m || ""}
                      onChange={(e) => handleEditChange("waterline_l_m", e.target.value ? Number(e.target.value) : null)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingPool?.volume_liters || ""}
                      onChange={(e) => handleEditChange("volume_liters", e.target.value ? Number(e.target.value) : null)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingPool?.salt_volume_bags || ""}
                      onChange={(e) => handleEditChange("salt_volume_bags", e.target.value ? Number(e.target.value) : null)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingPool?.salt_volume_bags_fixed || ""}
                      onChange={(e) => handleEditChange("salt_volume_bags_fixed", e.target.value ? Number(e.target.value) : null)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingPool?.weight_kg || ""}
                      onChange={(e) => handleEditChange("weight_kg", e.target.value ? Number(e.target.value) : null)}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={editingPool?.minerals_kg_initial || ""}
                      onChange={(e) => handleEditChange("minerals_kg_initial", e.target.value ? Number(e.target.value) : null)}
                      className="w-20"
                    />
                    /
                    <Input
                      type="number"
                      value={editingPool?.minerals_kg_topup || ""}
                      onChange={(e) => handleEditChange("minerals_kg_topup", e.target.value ? Number(e.target.value) : null)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.01"
                      value={editingPool?.buy_price_ex_gst || ""}
                      onChange={(e) => handleEditChange("buy_price_ex_gst", e.target.value ? Number(e.target.value) : null)}
                    />
                  </TableCell>
                  <TableCell>
                    {formatCurrency((editingPool?.buy_price_ex_gst || 0) * 1.1)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => editingPool && handleSaveEdit(editingPool)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{pool.range}</TableCell>
                  <TableCell>{pool.name}</TableCell>
                  <TableCell>{pool.length}m</TableCell>
                  <TableCell>{pool.width}m</TableCell>
                  <TableCell>{pool.depth_shallow}m</TableCell>
                  <TableCell>{pool.depth_deep}m</TableCell>
                  <TableCell>{pool.waterline_l_m}</TableCell>
                  <TableCell>{pool.volume_liters}</TableCell>
                  <TableCell>{pool.salt_volume_bags}</TableCell>
                  <TableCell>{pool.salt_volume_bags_fixed}</TableCell>
                  <TableCell>{pool.weight_kg}</TableCell>
                  <TableCell>{pool.minerals_kg_initial}/{pool.minerals_kg_topup}</TableCell>
                  <TableCell>{formatCurrency(pool.buy_price_ex_gst || 0)}</TableCell>
                  <TableCell>{formatCurrency(pool.buy_price_inc_gst || 0)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(pool)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PoolTable;
