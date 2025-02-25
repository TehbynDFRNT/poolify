
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Pool } from "@/types/pool";

export const usePoolSpecifications = () => {
  return useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      try {
        const { data: ranges } = await supabase
          .from("pool_ranges")
          .select("name")
          .order("display_order");

        const { data: poolsData, error: poolsError } = await supabase
          .from("pool_specifications")
          .select("*");

        if (poolsError) throw poolsError;

        const rangeOrder = ranges?.map(r => r.name) || [];
        const sortedPools = (poolsData || []).sort((a, b) => {
          const aIndex = rangeOrder.indexOf(a.range);
          const bIndex = rangeOrder.indexOf(b.range);
          return aIndex - bIndex;
        });

        return sortedPools as Pool[];
      } catch (error) {
        console.error('Error fetching pools:', error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to load pool specifications");
      }
    }
  });
};
