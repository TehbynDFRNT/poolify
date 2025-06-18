import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to calculate the total cost of custom add-ons for a project
 * @param customerId The pool project ID
 * @returns Total RRP cost of all custom add-ons
 */
export const useCustomAddOnsCost = (customerId: string | null) => {
  const { data: customAddOnsCost = 0, isLoading } = useQuery({
    queryKey: ['custom-add-ons-cost', customerId],
    queryFn: async () => {
      if (!customerId) return 0;

      try {
        const { data, error } = await supabase
          .from('pool_general_extras' as any)
          .select('rrp, quantity')
          .eq('pool_project_id', customerId)
          .eq('type', 'custom');

        if (error) throw error;

        // Calculate total RRP cost (rrp * quantity for each item)
        const totalCost = data.reduce((sum: number, item: any) => {
          return sum + ((item.rrp || 0) * (item.quantity || 1));
        }, 0);

        return totalCost;
      } catch (error) {
        console.error("Error fetching custom add-ons cost:", error);
        return 0;
      }
    },
    enabled: !!customerId
  });

  return {
    customAddOnsCost,
    isLoading
  };
};