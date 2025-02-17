
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { PoolFormValues, poolSchema } from "@/types/pool";
import type { PoolType } from "@/types/pool";

interface PoolFormProps {
  onSubmit: (values: PoolFormValues) => void;
  poolTypes: PoolType[];
  defaultValues?: Partial<PoolFormValues>;
}

export function PoolForm({ onSubmit, poolTypes, defaultValues }: PoolFormProps) {
  const form = useForm<PoolFormValues>({
    resolver: zodResolver(poolSchema),
    defaultValues: defaultValues || {
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

  return (
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
            {defaultValues ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
