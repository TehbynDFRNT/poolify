import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to calculate the total cost and margin of custom add-ons for a project
 * @param customerId The pool project ID
 * @returns Total RRP cost and margin of all custom add-ons
 */
export const useCustomAddOnsCost = (customerId: string | null) => {
  const { data = { cost: 0, margin: 0 }, isLoading } = useQuery({
    queryKey: ['custom-add-ons-cost', customerId],
    queryFn: async () => {
      if (!customerId) return { cost: 0, margin: 0 };

      try {
        const { data, error } = await supabase
          .from('pool_custom_addons')
          .select('rrp, margin')
          .eq('pool_project_id', customerId);

        if (error) throw error;

        // Calculate total RRP cost and margin
        const totals = data.reduce((acc: { cost: number, margin: number }, item: any) => {
          return {
            cost: acc.cost + (item.rrp || 0),
            margin: acc.margin + (item.margin || 0)
          };
        }, { cost: 0, margin: 0 });

        return totals;
      } catch (error) {
        console.error("Error fetching custom add-ons cost:", error);
        return { cost: 0, margin: 0 };
      }
    },
    enabled: !!customerId
  });

  return {
    customAddOnsCost: data.cost,
    customAddOnsMargin: data.margin,
    isLoading
  };
};