import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PoolDiscount, EditablePoolDiscount, DiscountPromotion } from "@/types/discount-promotion";

export const usePoolDiscounts = (poolProjectId?: string) => {
  const queryClient = useQueryClient();

  // Fetch pool discounts for a specific pool project
  const { data: poolDiscounts, isLoading: isLoadingPoolDiscounts } = useQuery({
    queryKey: ["pool-discounts", poolProjectId],
    queryFn: async () => {
      if (!poolProjectId) return [];
      
      const { data, error } = await supabase
        .from("pool_discounts")
        .select(`
          *,
          discount_promotion:discount_promotions!discount_promotion_uuid(*)
        `)
        .eq("pool_project_id", poolProjectId)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!poolProjectId,
  });

  // Fetch all available discount promotions
  const { data: availablePromotions, isLoading: isLoadingPromotions } = useQuery({
    queryKey: ["discount-promotions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("discount_promotions")
        .select("*")
        .order("discount_name");

      if (error) {
        throw error;
      }

      return data as DiscountPromotion[];
    },
  });

  // Add discount to pool
  const addDiscountMutation = useMutation({
    mutationFn: async (data: EditablePoolDiscount) => {
      const { error } = await supabase
        .from("pool_discounts")
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Discount added to pool successfully");
      queryClient.invalidateQueries({ queryKey: ["pool-discounts", poolProjectId] });
    },
    onError: (error) => {
      toast.error("Failed to add discount to pool");
      console.error("Error adding pool discount:", error);
    },
  });

  // Remove discount from pool
  const removeDiscountMutation = useMutation({
    mutationFn: async (discountId: string) => {
      const { error } = await supabase
        .from("pool_discounts")
        .delete()
        .eq("id", discountId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Discount removed from pool successfully");
      queryClient.invalidateQueries({ queryKey: ["pool-discounts", poolProjectId] });
    },
    onError: (error) => {
      toast.error("Failed to remove discount from pool");
      console.error("Error removing pool discount:", error);
    },
  });

  // Helper function to check if a discount is already applied to the pool
  const isDiscountApplied = (promotionUuid: string) => {
    return poolDiscounts?.some(pd => pd.discount_promotion_uuid === promotionUuid) || false;
  };

  // Helper function to get applied discounts with promotion details
  const getAppliedDiscountsWithDetails = () => {
    return poolDiscounts?.filter(pd => pd.discount_promotion) || [];
  };

  return {
    poolDiscounts,
    availablePromotions,
    isLoadingPoolDiscounts,
    isLoadingPromotions,
    addDiscount: addDiscountMutation.mutate,
    removeDiscount: removeDiscountMutation.mutate,
    isAddingDiscount: addDiscountMutation.isPending,
    isRemovingDiscount: removeDiscountMutation.isPending,
    isDiscountApplied,
    getAppliedDiscountsWithDetails,
  };
};