
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ExcavationDigType, PoolExcavationType } from "@/types/excavation-dig-type";

export const useDigTypes = () => {
  return useQuery({
    queryKey: ["excavation-dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as ExcavationDigType[];
    },
  });
};

export const usePoolExcavationTypes = () => {
  return useQuery({
    queryKey: ["pool-excavation-types"],
    queryFn: async () => {
      console.log('Fetching pools...');
      const { data, error } = await supabase
        .from("pool_excavation_types")
        .select(`
          *,
          dig_type:excavation_dig_types(*)
        `);
      
      if (error) throw error;

      // Sort pools by range (using the order from POOL_RANGES) and then by name
      return (data || []).sort((a, b) => {
        // First sort by range name
        if (a.range !== b.range) {
          return a.range.localeCompare(b.range);
        }
        // Then sort by pool name within the same range
        return a.name.localeCompare(b.name);
      }) as PoolExcavationType[];
    },
  });
};
