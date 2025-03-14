
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CraneSelection } from "./types";

export const useFetchCraneSelection = (poolId?: string) => {
  return useQuery({
    queryKey: ["crane-selection", poolId],
    queryFn: async () => {
      if (!poolId) return null;
      
      try {
        const { data, error } = await supabase
          .from('pool_crane_selections')
          .select('crane_id')
          .eq('pool_id', poolId)
          .maybeSingle();
            
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching crane selection:', error);
          return null;
        }
        
        if (data && typeof data === 'object' && 'crane_id' in data) {
          return { pool_id: poolId, crane_id: data.crane_id } as CraneSelection;
        }
        return null;
      } catch (error) {
        console.error('Error in crane selection query:', error);
        return null;
      }
    },
    enabled: !!poolId,
  });
};
