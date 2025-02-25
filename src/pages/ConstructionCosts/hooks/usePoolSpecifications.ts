
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Pool } from "@/types/pool";

export const usePoolSpecifications = () => {
  return useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      try {
        console.log('Fetching pool ranges...');
        const { data: ranges, error: rangesError } = await supabase
          .from("pool_ranges")
          .select("name")
          .order("display_order");

        if (rangesError) {
          console.error('Error fetching ranges:', rangesError);
          throw rangesError;
        }

        console.log('Fetching pools...');
        const { data: poolsData, error: poolsError } = await supabase
          .from("pool_specifications")
          .select("*");

        if (poolsError) {
          console.error('Error fetching pools:', poolsError);
          throw poolsError;
        }

        if (!poolsData) {
          console.error('No pool data returned');
          return [];
        }

        const rangeOrder = ranges?.map(r => r.name) || [];
        const sortedPools = poolsData.sort((a, b) => {
          const aIndex = rangeOrder.indexOf(a.range);
          const bIndex = rangeOrder.indexOf(b.range);
          return aIndex - bIndex;
        });

        console.log(`Successfully fetched ${sortedPools.length} pools`);
        return sortedPools as Pool[];
      } catch (error) {
        console.error('Error in usePoolSpecifications:', error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast.error("Failed to load pool specifications");
      }
    }
  });
};
