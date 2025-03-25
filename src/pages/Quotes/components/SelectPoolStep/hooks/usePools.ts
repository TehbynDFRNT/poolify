
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";

export const usePools = () => {
  // Fetch pool specifications
  const { data: pools, isLoading, error } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .order("range", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Pool[];
    },
  });

  // Group pools by range for better organization in the dropdown
  const poolsByRange = pools?.reduce((acc, pool) => {
    if (!acc[pool.range]) {
      acc[pool.range] = [];
    }
    acc[pool.range].push(pool);
    return acc;
  }, {} as Record<string, Pool[]>) || {};

  return {
    pools,
    poolsByRange,
    isLoading,
    error
  };
};
