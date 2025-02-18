import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { poolSchema, PoolFormValues } from "@/types/pool";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddPoolForm = () => {
  const form = useForm<PoolFormValues>({
    resolver: zodResolver(poolSchema),
    defaultValues: {
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
      standard_filtration_package_id: null,
    },
  });

  const [poolRanges, setPoolRanges] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPoolRanges = async () => {
      const { data, error } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      if (error) {
        console.error("Error fetching pool ranges:", error);
        toast.error("Failed to load pool ranges.");
        return;
      }

      if (data) {
        const ranges = data.map((item) => item.name);
        setPoolRanges(ranges);
      }
    };

    fetchPoolRanges();
  }, []);

  async function onSubmit(values: PoolFormValues) {
    setLoading(true);
    try {
      // Ensure all required fields are present with their correct types
      const poolData = {
        name: values.name,
        range: values.range,
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
        standard_filtration_package_id: values.standard_filtration_package_id,
      };

      const { data, error } = await supabase
        .from("pool_specifications")
        .insert([poolData])
        .select();

      if (error) {
        console.error("Error creating pool:", error);
        toast.error("Failed to create pool.");
        return;
      }

      toast.success("Pool created successfully!");
      navigate(`/pricing-models/pool/${data[0].id}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Pool Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="range"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Range</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a range" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {poolRanges.map((range) => (
                      <SelectItem key={range} value={range}>
                        {range}
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
                  <Input
                    type="number"
                    placeholder="Pool Length"
                    {...field}
                  />
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
                  <Input
                    type="number"
                    placeholder="Pool Width"
                    {...field}
                  />
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
                <FormLabel>Shallow Depth (m)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Shallow Depth"
                    {...field}
                  />
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
                <FormLabel>Deep Depth (m)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Deep Depth"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="waterline_l_m"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Waterline (L/m)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Waterline"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="volume_liters"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume (Liters)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Volume"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salt_volume_bags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salt Volume (Bags)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Salt Volume"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="salt_volume_bags_fixed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salt Volume Fixed (Bags)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Salt Volume Fixed"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight_kg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (KG)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Weight"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minerals_kg_initial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minerals Initial (KG)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Minerals Initial"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minerals_kg_topup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minerals Topup (KG)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Minerals Topup"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buy_price_ex_gst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy Price (Ex GST)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Buy Price Ex GST"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="buy_price_inc_gst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Buy Price (Inc GST)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Buy Price Inc GST"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Pool"}
        </Button>
      </form>
    </Form>
  );
};

export default AddPoolForm;
