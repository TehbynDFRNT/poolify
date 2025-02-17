
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type { EditableTrafficControlCost } from "@/types/traffic-control-cost";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddTrafficControlCostFormProps {
  onSuccess: () => void;
}

export const AddTrafficControlCostForm = ({ onSuccess }: AddTrafficControlCostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<EditableTrafficControlCost>({
    defaultValues: {
      name: "",
      price: 0,
      display_order: 0,
    },
  });

  const onSubmit = async (data: EditableTrafficControlCost) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("traffic_control_costs")
        .insert([data]);

      if (error) throw error;

      toast.success("New traffic control cost added successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["traffic-control-costs"] });
      onSuccess();
    } catch (error) {
      toast.error("Failed to add new traffic control cost");
      console.error("Error adding traffic control cost:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter traffic control level" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_order"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display Order</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          Add New Traffic Control Cost
        </Button>
      </form>
    </Form>
  );
};
