
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
      console.log('Fetching pool ranges...');
      const { data: ranges, error: rangesError } = await supabase
        .from("pool_ranges")
        .select("*")
        .order("display_order");

      if (rangesError) {
        console.error('Error fetching ranges:', rangesError);
        throw rangesError;
      }

      console.log('Fetching pools...');
      const { data, error } = await supabase
        .from("pool_excavation_types")
        .select(`
          *,
          dig_type:excavation_dig_types(*)
        `);
      
      if (error) throw error;

      // Create an ordered map of ranges using display_order
      const rangeOrder = new Map(
        ranges?.map((r, index) => [r.name, index]) || []
      );

      return (data || []).sort((a, b) => {
        // Get the order index for each range, defaulting to Infinity if not found
        // This ensures unknown ranges go to the end
        const aIndex = rangeOrder.get(a.range) ?? Infinity;
        const bIndex = rangeOrder.get(b.range) ?? Infinity;
        
        // First sort by range order
        if (aIndex !== bIndex) return aIndex - bIndex;
        
        // Then sort by name within the same range
        return a.name.localeCompare(b.name);
      }) as PoolExcavationType[];
    },
  });
};
