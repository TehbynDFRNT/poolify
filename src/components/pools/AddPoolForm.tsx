
import { useState } from "react";
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
import { toast } from "sonner";
import type { NewPool } from "@/types/pool";
import { POOL_RANGES } from "@/types/pool";

interface AddPoolFormProps {
  onClose: () => void;
}

const AddPoolForm = ({ onClose }: AddPoolFormProps) => {
  const queryClient = useQueryClient();
  const [newPool, setNewPool] = useState<NewPool>({
    name: "",
    range: "",
    length: 0,
    width: 0,
    depth_shallow: 0,
    depth_deep: 0,
    waterline_l_m: null,
    volume_liters: null,
    salt_volume_bags: null,
    salt_volume_bags_fixed: null,
    weight_kg: null,
    minerals_kg_initial: null,
    minerals_kg_topup: null,
    buy_price_ex_gst: null,
    buy_price_inc_gst: null,
  });

  const addPoolMutation = useMutation({
    mutationFn: async (pool: NewPool) => {
      const poolWithGST = {
        ...pool,
        buy_price_inc_gst: pool.buy_price_ex_gst ? pool.buy_price_ex_gst * 1.1 : null,
      };
      const { error } = await supabase
        .from("pool_specifications")
        .insert(poolWithGST);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool specification added successfully");
      onClose();
    },
    onError: (error) => {
      toast.error("Failed to add pool specification");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPoolMutation.mutate(newPool);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-4 gap-4 mb-8">
      <Select
        value={newPool.range}
        onValueChange={(value) => setNewPool({ ...newPool, range: value })}
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
      <Input
        placeholder="Name"
        value={newPool.name}
        onChange={(e) => setNewPool({ ...newPool, name: e.target.value })}
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Length (m)"
        value={newPool.length}
        onChange={(e) => setNewPool({ ...newPool, length: Number(e.target.value) })}
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Width (m)"
        value={newPool.width}
        onChange={(e) => setNewPool({ ...newPool, width: Number(e.target.value) })}
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Shallow End (m)"
        value={newPool.depth_shallow}
        onChange={(e) => setNewPool({ ...newPool, depth_shallow: Number(e.target.value) })}
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Deep End (m)"
        value={newPool.depth_deep}
        onChange={(e) => setNewPool({ ...newPool, depth_deep: Number(e.target.value) })}
      />
      <Input
        type="number"
        step="0.1"
        placeholder="Waterline L/M"
        value={newPool.waterline_l_m || ""}
        onChange={(e) => setNewPool({ ...newPool, waterline_l_m: e.target.value ? Number(e.target.value) : null })}
      />
      <Input
        type="number"
        placeholder="Water Volume (L)"
        value={newPool.volume_liters || ""}
        onChange={(e) => setNewPool({ ...newPool, volume_liters: e.target.value ? Number(e.target.value) : null })}
      />
      <Input
        type="number"
        placeholder="Salt Volume Bags"
        value={newPool.salt_volume_bags || ""}
        onChange={(e) => setNewPool({ ...newPool, salt_volume_bags: e.target.value ? Number(e.target.value) : null })}
      />
      <Input
        type="number"
        placeholder="Salt Volume Fixed"
        value={newPool.salt_volume_bags_fixed || ""}
        onChange={(e) => setNewPool({ ...newPool, salt_volume_bags_fixed: e.target.value ? Number(e.target.value) : null })}
      />
      <Input
        type="number"
        placeholder="Weight (KG)"
        value={newPool.weight_kg || ""}
        onChange={(e) => setNewPool({ ...newPool, weight_kg: e.target.value ? Number(e.target.value) : null })}
      />
      <Input
        type="number"
        placeholder="Minerals Initial"
        value={newPool.minerals_kg_initial || ""}
        onChange={(e) => setNewPool({ ...newPool, minerals_kg_initial: e.target.value ? Number(e.target.value) : null })}
      />
      <Input
        type="number"
        placeholder="Minerals Topup"
        value={newPool.minerals_kg_topup || ""}
        onChange={(e) => setNewPool({ ...newPool, minerals_kg_topup: e.target.value ? Number(e.target.value) : null })}
      />
      <Input
        type="number"
        step="0.01"
        placeholder="Buy Price (ex GST)"
        value={newPool.buy_price_ex_gst || ""}
        onChange={(e) => setNewPool({ ...newPool, buy_price_ex_gst: e.target.value ? Number(e.target.value) : null })}
      />
      <Button type="submit" className="col-span-4">Add Pool</Button>
    </form>
  );
};

export default AddPoolForm;
