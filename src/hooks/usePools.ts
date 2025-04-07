
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";

export const usePools = () => {
  return useQuery({
    queryKey: ['pool-specifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pool_specifications')
        .select('*');
        
      if (error) throw error;
      return data as Pool[];
    }
  });
};
