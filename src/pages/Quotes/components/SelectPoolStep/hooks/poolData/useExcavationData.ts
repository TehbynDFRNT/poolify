
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useExcavationData = (poolId?: string) => {
  return useQuery({
    queryKey: ["pool-excavation", poolId],
    queryFn: async () => {
      if (!poolId) return null;
      
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          pool_id,
          dig_type:dig_types (*)
        `)
        .eq('pool_id', poolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.dig_type;
    },
    enabled: !!poolId,
  });
};
