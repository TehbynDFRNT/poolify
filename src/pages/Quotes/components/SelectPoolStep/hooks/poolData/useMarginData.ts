
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMarginData = (poolId?: string) => {
  return useQuery({
    queryKey: ["pool-margin", poolId],
    queryFn: async () => {
      if (!poolId) return null;
      
      const { data, error } = await supabase
        .from("pool_margins")
        .select("margin_percentage")
        .eq("pool_id", poolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.margin_percentage : 0;
    },
    enabled: !!poolId,
  });
};
