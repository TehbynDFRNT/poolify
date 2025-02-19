
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Pool } from "@/types/pool";

export const usePools = () => {
  return useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select("*");

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      }) as Pool[];
    },
  });
};
