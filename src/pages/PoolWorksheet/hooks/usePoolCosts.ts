
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoolCosts = () => {
  return useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*");
      
      if (error) throw error;
      
      const costsMap = new Map();
      data?.forEach(cost => {
        costsMap.set(cost.pool_id, cost);
      });
      
      return costsMap;
    }
  });
};
