
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Type definition based on the pool_specifications table schema
type Pool = {
  id: string;
  name: string;
  length: number;
  width: number;
  depth_shallow: number;
  depth_deep: number;
  volume_liters: number | null;
  range: string;
  created_at: string;
};

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
