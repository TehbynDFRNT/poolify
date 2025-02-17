import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

const poolSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dig_level: z.string().min(1, "Dig level is required"),
  pool_type_id: z.string().min(1, "Pool type is required"),
  length: z.coerce.number().min(0, "Length must be positive"),
  width: z.coerce.number().min(0, "Width must be positive"),
  depth_shallow: z.coerce.number().min(0, "Shallow depth must be positive"),
  depth_deep: z.coerce.number().min(0, "Deep depth must be positive"),
  waterline_l_m: z.coerce.number().nullable(),
  volume_liters: z.coerce.number().nullable(),
  salt_volume_bags: z.coerce.number().nullable(),
  salt_volume_bags_fixed: z.coerce.number().nullable(),
  weight_kg: z.coerce.number().nullable(),
  minerals_kg_initial: z.coerce.number().nullable(),
  minerals_kg_topup: z.coerce.number().nullable(),
  buy_price_ex_gst: z.coerce.number().nullable(),
  buy_price_inc_gst: z.coerce.number().nullable(),
});

type PoolFormValues = z.infer<typeof poolSchema>;

const PoolSpecifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingPool, setEditingPool] = useState<any>(null);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(poolSchema),
    defaultValues: {
      name: "",
      dig_level: "",
      pool_type_id: "",
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
    },
  });

  const { data: pools, isLoading: poolsLoading } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          pool_type:pool_types(id, name)
        `);

      if (error) throw error;
      return data;
    },
  });

  const { data: poolTypes, isLoading: poolTypesLoading } = useQuery({
    queryKey: ["pool-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_types")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (values: PoolFormValues) => {
      // Ensure all required fields are present
      const poolData = {
        name: values.name,
        dig_level: values.dig_level,
        pool_type_id: values.pool_type_id,
        length: values.length,
        width: values.width,
        depth_shallow: values.depth_shallow,
        depth_deep: values.depth_deep,
        waterline_l_m: values.waterline_l_m,
        volume_liters: values.volume_liters,
        salt_volume_bags: values.salt_volume_bags,
        salt_volume_bags_fixed: values.salt_volume_bags_fixed,
        weight_kg: values.weight_kg,
        minerals_kg_initial: values.minerals_kg_initial,
        minerals_kg_topup: values.minerals_kg_topup,
        buy_price_ex_gst: values.buy_price_ex_gst,
        buy_price_inc_gst: values.buy_price_inc_gst,
      };

      const { error } = await supabase
        .from("pool_specifications")
        .insert([poolData]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      setIsOpen(false);
      form.reset();
      toast.success("Pool specification created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create pool specification");
      console.error(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (values: PoolFormValues) => {
      // Ensure all required fields are present
      const poolData = {
        name: values.name,
        dig_level: values.dig_level,
        pool_type_id: values.pool_type_id,
        length: values.length,
        width: values.width,
        depth_shallow: values.depth_shallow,
        depth_deep: values.depth_deep,
        waterline_l_m: values.waterline_l_m,
        volume_liters: values.volume_liters,
        salt_volume_bags: values.salt_volume_bags,
        salt_volume_bags_fixed: values.salt_volume_bags_fixed,
        weight_kg: values.weight_kg,
        minerals_kg_initial: values.minerals_kg_initial,
        minerals_kg_topup: values.minerals_kg_topup,
        buy_price_ex_gst: values.buy_price_ex_gst,
        buy_price_inc_gst: values.buy_price_inc_gst,
      };

      const { error } = await supabase
        .from("pool_specifications")
        .update(poolData)
        .eq("id", editingPool.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      setIsOpen(false);
      setEditingPool(null);
      form.reset();
      toast.success("Pool specification updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pool specification");
      console.error(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("pool_specifications")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool specification deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete pool specification");
      console.error(error);
    },
  });

  const onSubmit = (values: z.infer<typeof poolSchema>) => {
    if (editingPool) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  const handleEdit = (pool: any) => {
    setEditingPool(pool);
    form.reset({
      name: pool.name,
      dig_level: pool.dig_level || "",
      pool_type_id: pool.pool_type_id,
      length: pool.length,
      width: pool.width,
      depth_shallow: pool.depth_shallow,
      depth_deep: pool.depth_deep,
      waterline_l_m: pool.waterline_l_m,
      volume_liters: pool.volume_liters,
      salt_volume_bags: pool.salt_volume_bags,
      salt_volume_bags_fixed: pool.salt_volume_bags_fixed,
      weight_kg: pool.weight_kg,
      minerals_kg_initial: pool.minerals_kg_initial,
      minerals_kg_topup: pool.minerals_kg_topup,
      buy_price_ex_gst: pool.buy_price_ex_gst,
      buy_price_inc_gst: pool.buy_price_inc_gst,
    });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this pool specification?")) {
      deleteMutation.mutate(id);
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("en-AU", {
      style: "currency",
      currency: "AUD",
    }).format(value);
  };

  if (poolsLoading || poolTypesLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Pool Specifications</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingPool(null);
                  form.reset();
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Pool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPool ? "Edit Pool Specification" : "Add New Pool Specification"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dig_level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dig Level</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="pool_type_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pool Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select pool type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {poolTypes?.map((type) => (
                                <SelectItem key={type.id} value={type.id}>
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Length (m)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Width (m)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="depth_shallow"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shallow End (m)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="depth_deep"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Deep End (m)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <Button type="submit">
                      {editingPool ? "Update" : "Create"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <ScrollArea className="h-[800px] overflow-x-auto">
              <div className="min-w-[1800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Actions</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Dig Level</TableHead>
                      <TableHead>Pool Size</TableHead>
                      <TableHead>Length</TableHead>
                      <TableHead>Width</TableHead>
                      <TableHead>Shallow End</TableHead>
                      <TableHead>Deep End</TableHead>
                      <TableHead>Waterline L/M</TableHead>
                      <TableHead>Water Volume (L)</TableHead>
                      <TableHead>Salt Volume Bags</TableHead>
                      <TableHead>Salt Volume Fixed</TableHead>
                      <TableHead>Weight (KG)</TableHead>
                      <TableHead>Minerals Initial/Topup</TableHead>
                      <TableHead>Buy Price (ex GST)</TableHead>
                      <TableHead>Buy Price (inc GST)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pools?.map((pool) => (
                      <TableRow key={pool.id}>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(pool)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(pool.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>{pool.name}</TableCell>
                        <TableCell>{pool.dig_level}</TableCell>
                        <TableCell>{pool.pool_type?.name}</TableCell>
                        <TableCell>{pool.length}m</TableCell>
                        <TableCell>{pool.width}m</TableCell>
                        <TableCell>{pool.depth_shallow}m</TableCell>
                        <TableCell>{pool.depth_deep}m</TableCell>
                        <TableCell>{pool.waterline_l_m}</TableCell>
                        <TableCell>{pool.volume_liters}</TableCell>
                        <TableCell>{pool.salt_volume_bags}</TableCell>
                        <TableCell>{pool.salt_volume_bags_fixed}</TableCell>
                        <TableCell>{pool.weight_kg}</TableCell>
                        <TableCell>
                          {pool.minerals_kg_initial}/{pool.minerals_kg_topup}
                        </TableCell>
                        <TableCell>{formatCurrency(pool.buy_price_ex_gst)}</TableCell>
                        <TableCell>{formatCurrency(pool.buy_price_inc_gst)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PoolSpecifications;
