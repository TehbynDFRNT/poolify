import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EditablePoolDiscount, DiscountPromotion } from "@/types/discount-promotion";


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
          discount_promotion:discount_promotions!pool_discounts_discount_promotion_uuid_fkey(*)
        `)
        .eq("pool_project_id", poolProjectId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching pool discounts:", error);
        throw error;
      }

      return data || [];
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
        console.error("Error fetching discount promotions:", error);
        throw error;
      }

      return data as any as DiscountPromotion[];
    },
  });

  // Add discount to pool (replaces existing discount if any)
  const addDiscountMutation = useMutation({
    mutationFn: async (data: EditablePoolDiscount) => {
      const { error } = await supabase
        .from("pool_discounts" as any)
        .upsert(data, { onConflict: "pool_project_id,discount_promotion_uuid" });

      if (error) {
        console.error("Error adding pool discount:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Discount applied to pool successfully");
      queryClient.invalidateQueries({ queryKey: ["pool-discounts", poolProjectId] });
    },
    onError: (error) => {
      toast.error("Failed to apply discount to pool");
      console.error("Error applying pool discount:", error);
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

  // Helper function to get the currently applied discount (only one allowed)
  const getCurrentlyAppliedDiscount = () => {
    return poolDiscounts?.[0] || null;
  };

  // Helper function to get applied discounts with promotion details (now returns single discount)
  const getAppliedDiscountsWithDetails = () => {
    const discounts = poolDiscounts?.filter(pd => pd.discount_promotion) || [];
    // Map to ensure proper typing for the calculator
    return discounts.map(d => ({
      id: d.id,
      discount_promotion: {
        uuid: d.discount_promotion.uuid,
        discount_name: d.discount_promotion.discount_name,
        discount_type: d.discount_promotion.discount_type as 'dollar' | 'percentage',
        dollar_value: d.discount_promotion.dollar_value || undefined,
        percentage_value: d.discount_promotion.percentage_value || undefined,
      }
    }));
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
    getCurrentlyAppliedDiscount,
    getAppliedDiscountsWithDetails,
  };
};