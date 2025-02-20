
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { DigType, PoolDigType } from "@/types/excavation-dig-type";

export const useDigTypes = () => {
  return useQuery({
    queryKey: ["dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dig_types")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as DigType[];
    },
  });
};

export const usePoolDigTypes = () => {
  return useQuery({
    queryKey: ["pool-dig-types"],
    queryFn: async () => {
      console.log('Fetching pools...');
      const { data, error } = await supabase
        .from("pool_dig_types")
        .select(`
          *,
          dig_type:dig_types(*)
        `);
      
      if (error) throw error;

      // Sort pools by range and then by name
      return (data || []).sort((a, b) => {
        if (a.pool_range !== b.pool_range) {
          return a.pool_range.localeCompare(b.pool_range);
        }
        return a.pool_name.localeCompare(b.pool_name);
      }) as PoolDigType[];
    },
  });
};
