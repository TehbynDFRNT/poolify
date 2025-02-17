
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
import type { EditableBobcatCost } from "@/types/bobcat-cost";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddBobcatCostFormProps {
  sizeCategory: string;
  onSuccess: () => void;
}

export const AddBobcatCostForm = ({ sizeCategory, onSuccess }: AddBobcatCostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<EditableBobcatCost>({
    defaultValues: {
      size_category: sizeCategory,
      day_code: "",
      price: 0,
      display_order: 0,
    },
  });

  const onSubmit = async (data: EditableBobcatCost) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("bobcat_costs")
        .insert([data]);

      if (error) throw error;

      toast.success("New code added successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["bobcat-costs"] });
      onSuccess();
    } catch (error) {
      toast.error("Failed to add new code");
      console.error("Error adding bobcat cost:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="day_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder="D10" />
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
          Add New Code
        </Button>
      </form>
    </Form>
  );
};
