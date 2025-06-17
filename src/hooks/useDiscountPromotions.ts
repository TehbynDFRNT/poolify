import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
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
        .from("discount_promotions")
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
        .from("discount_promotions")
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

  // Delete discount promotion
  const deleteDiscountMutation = useMutation({
    mutationFn: async (promotionUuid: string) => {
      // First, delete all pool_discounts that reference this promotion
      const { error: poolDiscountsError } = await supabase
        .from("pool_discounts")
        .delete()
        .eq("discount_promotion_uuid", promotionUuid);

      if (poolDiscountsError) {
        console.error("Error deleting pool discounts:", poolDiscountsError);
        throw poolDiscountsError;
      }

      // Then delete the discount promotion itself
      const { error } = await supabase
        .from("discount_promotions")
        .delete()
        .eq("uuid", promotionUuid);

      if (error) {
        console.error("Error deleting discount promotion:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Discount promotion deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["discount-promotions"] });
      // Also invalidate pool discounts queries to refresh any affected pools
      queryClient.invalidateQueries({ queryKey: ["pool-discounts"] });
    },
    onError: (error) => {
      toast.error("Failed to delete discount promotion");
      console.error("Error deleting discount promotion:", error);
    },
  });

  const handleDelete = async (promotionUuid: string) => {
    deleteDiscountMutation.mutate(promotionUuid);
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
    handleDelete,
    isDeletingPromotion: deleteDiscountMutation.isPending,
  };
};