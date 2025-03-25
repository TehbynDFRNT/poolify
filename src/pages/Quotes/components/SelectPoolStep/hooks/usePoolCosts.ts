
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoolCosts = (selectedPoolId: string) => {
  // Fetch individual costs for the selected pool
  const { data: poolCosts } = useQuery({
    queryKey: ["pool-costs", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq('pool_id', selectedPoolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!selectedPoolId,
  });

  // Fetch fixed costs
  const { data: fixedCosts } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  return {
    poolCosts,
    fixedCosts
  };
};
