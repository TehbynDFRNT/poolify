
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoolCostsData = (poolId?: string) => {
  return useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      if (!poolId) return null;
      
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq('pool_id', poolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!poolId,
  });
};
