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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import type { EditableDiscountPromotion } from "@/types/discount-promotion";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AddDiscountPromotionFormProps {
  onSuccess: () => void;
}

export const AddDiscountPromotionForm = ({ onSuccess }: AddDiscountPromotionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  const form = useForm<EditableDiscountPromotion>({
    defaultValues: {
      discount_name: "",
      discount_type: "dollar",
      dollar_value: 0,
      percentage_value: 0,
    },
  });

  const watchDiscountType = form.watch("discount_type");

  const onSubmit = async (data: EditableDiscountPromotion) => {
    setIsSubmitting(true);
    try {
      // Prepare data based on discount type
      const insertData = {
        discount_name: data.discount_name,
        discount_type: data.discount_type,
        ...(data.discount_type === 'dollar' 
          ? { dollar_value: data.dollar_value, percentage_value: null }
          : { percentage_value: data.percentage_value, dollar_value: null }
        )
      };

      const { error } = await supabase
        .from("discount_promotions")
        .insert([insertData]);

      if (error) throw error;

      toast.success("New discount promotion added successfully");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["discount-promotions"] });
      onSuccess();
    } catch (error) {
      toast.error("Failed to add new discount promotion");
      console.error("Error adding discount promotion:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="discount_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter discount promotion name" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="dollar">Dollar Amount</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        {watchDiscountType === "dollar" ? (
          <FormField
            control={form.control}
            name="dollar_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dollar Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    placeholder="Enter discount amount"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        ) : (
          <FormField
            control={form.control}
            name="percentage_value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Percentage Value</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    min="0"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    placeholder="Enter percentage (0-100)"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        )}
        <Button type="submit" disabled={isSubmitting}>
          Add Discount Promotion
        </Button>
      </form>
    </Form>
  );
};