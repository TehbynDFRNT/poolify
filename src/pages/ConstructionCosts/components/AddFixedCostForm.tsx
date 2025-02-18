
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
import type { EditableFixedCost } from "@/types/fixed-cost";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddFixedCostFormProps {
  onSuccess: () => void;
}

export const AddFixedCostForm = ({ onSuccess }: AddFixedCostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<EditableFixedCost>({
    defaultValues: {
      name: "",
      price: 0,
      display_order: 0,
    },
  });

  const onSubmit = async (data: EditableFixedCost) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("fixed_costs")
        .insert([data]);

      if (error) throw error;

      toast.success("New fixed cost added successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["fixed-costs"] });
      onSuccess();
    } catch (error) {
      toast.error("Failed to add new fixed cost");
      console.error("Error adding fixed cost:", error);
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
                <Input {...field} placeholder="Enter item name" />
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
          Add Fixed Cost
        </Button>
      </form>
    </Form>
  );
};
