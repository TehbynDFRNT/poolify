
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
import type { EditableCraneCost } from "@/types/crane-cost";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddCraneCostFormProps {
  onSuccess: () => void;
}

export const AddCraneCostForm = ({ onSuccess }: AddCraneCostFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<EditableCraneCost>({
    defaultValues: {
      name: "",
      price: 0,
      display_order: 0,
    },
  });

  const onSubmit = async (data: EditableCraneCost) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("crane_costs")
        .insert([data]);

      if (error) throw error;

      toast.success("New crane cost added successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["crane-costs"] });
      onSuccess();
    } catch (error) {
      toast.error("Failed to add new crane cost");
      console.error("Error adding crane cost:", error);
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
                <Input {...field} placeholder="Enter crane name/description" />
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
          Add New Crane Cost
        </Button>
      </form>
    </Form>
  );
};
