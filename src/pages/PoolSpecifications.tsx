
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { Pool, NewPool } from "@/types/pool";
import { POOL_RANGES } from "@/types/pool";

const PoolSpecifications = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
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

  const { data: pools } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .order("range")
        .order("name");
      if (error) throw error;
      return (data || []) as Pool[];
    },
  });

  const addPoolMutation = useMutation({
    mutationFn: async (pool: NewPool) => {
      const { error } = await supabase
        .from("pool_specifications")
        .insert(pool);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool specification added successfully");
      setShowForm(false);
      setNewPool({
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
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pool Specifications</CardTitle>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Pool
          </Button>
        </CardHeader>
        <CardContent>
          {showForm && (
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
                onChange={(e) => setNewPool({ ...newPool, waterline_l_m: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Water Volume (L)"
                value={newPool.volume_liters || ""}
                onChange={(e) => setNewPool({ ...newPool, volume_liters: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Salt Volume Bags"
                value={newPool.salt_volume_bags || ""}
                onChange={(e) => setNewPool({ ...newPool, salt_volume_bags: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Salt Volume Fixed"
                value={newPool.salt_volume_bags_fixed || ""}
                onChange={(e) => setNewPool({ ...newPool, salt_volume_bags_fixed: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Weight (KG)"
                value={newPool.weight_kg || ""}
                onChange={(e) => setNewPool({ ...newPool, weight_kg: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Minerals Initial"
                value={newPool.minerals_kg_initial || ""}
                onChange={(e) => setNewPool({ ...newPool, minerals_kg_initial: Number(e.target.value) })}
              />
              <Input
                type="number"
                placeholder="Minerals Topup"
                value={newPool.minerals_kg_topup || ""}
                onChange={(e) => setNewPool({ ...newPool, minerals_kg_topup: Number(e.target.value) })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Buy Price (ex GST)"
                value={newPool.buy_price_ex_gst || ""}
                onChange={(e) => setNewPool({ ...newPool, buy_price_ex_gst: Number(e.target.value) })}
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Buy Price (inc GST)"
                value={newPool.buy_price_inc_gst || ""}
                onChange={(e) => setNewPool({ ...newPool, buy_price_inc_gst: Number(e.target.value) })}
              />
              <Button type="submit" className="col-span-4">Add Pool</Button>
            </form>
          )}
          
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {pools?.map((pool) => (
                  <TableRow key={pool.id}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSpecifications;
