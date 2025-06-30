import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { EditablePoolDiscount, DiscountPromotion, EditableDiscountPromotion } from "@/types/discount-promotion";


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

  // Fetch available discount promotions (universal and bespoke for this pool)
  const { data: availablePromotions, isLoading: isLoadingPromotions } = useQuery({
    queryKey: ["discount-promotions", "filtered", poolProjectId],
    queryFn: async () => {
      // Fetch all discounts first
      const { data: allDiscounts, error } = await supabase
        .from("discount_promotions")
        .select("*")
        .order("discount_name");

      if (error) {
        console.error("Error fetching discount promotions:", error);
        throw error;
      }

      console.log("All discounts fetched:", allDiscounts);
      console.log("Current poolProjectId:", poolProjectId);

      // If no filtering needed, return all
      if (!poolProjectId) {
        console.log("No poolProjectId, returning all discounts");
        return allDiscounts || [];
      }

      // Filter to show universal and bespoke for this pool
      const filtered = allDiscounts?.filter(discount => {
        // If no applicability field or it's universal, include it
        if (!discount.applicability || discount.applicability === 'universal') {
          console.log(`Including universal discount: ${discount.discount_name}`);
          return true;
        }
        // If it's bespoke, only include if it's for this pool
        if (discount.applicability === 'bespoke') {
          const matches = discount.pool_project_id === poolProjectId;
          console.log(`Bespoke discount: ${discount.discount_name}, pool_id: ${discount.pool_project_id}, current pool: ${poolProjectId}, matches: ${matches}`);
          return matches;
        }
        return false;
      }) || [];

      console.log("Filtered discounts:", filtered);
      return filtered;
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
        applicability: d.discount_promotion.applicability,
      }
    }));
  };

  // Create bespoke discount and apply it to pool
  const createBespokeDiscountMutation = useMutation({
    mutationFn: async (discountData: {
      discount_name: string;
      discount_type: 'dollar' | 'percentage';
      value: number;
    }) => {
      // First create the bespoke discount promotion
      const promotionData: EditableDiscountPromotion & { applicability: 'bespoke'; pool_project_id: string } = {
        discount_name: discountData.discount_name,
        discount_type: discountData.discount_type,
        applicability: 'bespoke',
        pool_project_id: poolProjectId!,
        ...(discountData.discount_type === 'dollar' 
          ? { dollar_value: discountData.value }
          : { percentage_value: discountData.value }
        )
      };

      const { data: newPromotion, error: promotionError } = await supabase
        .from("discount_promotions")
        .insert(promotionData)
        .select()
        .single();

      if (promotionError) {
        console.error("Error creating bespoke discount promotion:", promotionError);
        throw promotionError;
      }

      // Then apply it to the pool
      const poolDiscountData: EditablePoolDiscount = {
        pool_project_id: poolProjectId!,
        discount_promotion_uuid: newPromotion.uuid,
      };

      const { error: poolDiscountError } = await supabase
        .from("pool_discounts" as any)
        .insert(poolDiscountData);

      if (poolDiscountError) {
        // If applying to pool fails, delete the created promotion
        await supabase
          .from("discount_promotions")
          .delete()
          .eq("uuid", newPromotion.uuid);
        
        console.error("Error applying bespoke discount to pool:", poolDiscountError);
        throw poolDiscountError;
      }

      return newPromotion;
    },
    onSuccess: () => {
      toast.success("Bespoke discount created and applied successfully");
      queryClient.invalidateQueries({ queryKey: ["pool-discounts", poolProjectId] });
      queryClient.invalidateQueries({ queryKey: ["discount-promotions"] });
    },
    onError: (error) => {
      toast.error("Failed to create bespoke discount");
      console.error("Error creating bespoke discount:", error);
    },
  });

  return {
    poolDiscounts,
    availablePromotions,
    isLoadingPoolDiscounts,
    isLoadingPromotions,
    addDiscount: addDiscountMutation.mutate,
    removeDiscount: removeDiscountMutation.mutate,
    createBespokeDiscount: createBespokeDiscountMutation.mutate,
    isAddingDiscount: addDiscountMutation.isPending,
    isRemovingDiscount: removeDiscountMutation.isPending,
    isCreatingBespokeDiscount: createBespokeDiscountMutation.isPending,
    isDiscountApplied,
    getCurrentlyAppliedDiscount,
    getAppliedDiscountsWithDetails,
  };
};