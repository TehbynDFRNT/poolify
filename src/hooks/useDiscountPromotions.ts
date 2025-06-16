import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DiscountPromotion } from "@/types/discount-promotion";

export const useDiscountPromotions = () => {
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const { data: discountPromotions, isLoading } = useQuery({
    queryKey: ["discount-promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discount_promotions" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data as DiscountPromotion[];
    },
  });

  const startEditing = (promotion: DiscountPromotion) => {
    setEditingId(promotion.uuid);
    const currentValue = promotion.discount_type === 'dollar' 
      ? promotion.dollar_value?.toString() || '0'
      : promotion.percentage_value?.toString() || '0';
    setEditingValue(currentValue);
  };

  const handleSave = async (promotion: DiscountPromotion) => {
    try {
      const newValue = parseFloat(editingValue);
      if (isNaN(newValue)) {
        toast.error(`Please enter a valid ${promotion.discount_type === 'dollar' ? 'dollar amount' : 'percentage'}`);
        return;
      }

      const updateData = promotion.discount_type === 'dollar' 
        ? { dollar_value: newValue }
        : { percentage_value: newValue };

      const { error } = await supabase
        .from("discount_promotions" as any)
        .update(updateData)
        .eq("uuid", promotion.uuid);

      if (error) throw error;

      toast.success("Discount promotion updated successfully");
      queryClient.invalidateQueries({ queryKey: ["discount-promotions"] });
    } catch (error) {
      toast.error("Failed to update discount promotion");
      console.error("Error updating discount promotion:", error);
    } finally {
      setEditingId(null);
      setEditingValue("");
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingValue("");
  };

  return {
    discountPromotions,
    isLoading,
    editingId,
    editingValue,
    isAdding,
    setIsAdding,
    startEditing,
    handleSave,
    handleCancel,
    setEditingValue,
  };
};