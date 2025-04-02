
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoolDigMatches = () => {
  return useQuery({
    queryKey: ["pool-dig-type-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          id,
          pool_id,
          dig_type_id,
          dig_type:dig_types(*)
        `);
      
      if (error) throw error;
      
      const matchesMap = new Map();
      data?.forEach(match => {
        matchesMap.set(match.pool_id, match);
      });
      
      return matchesMap;
    }
  });
};
