import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Temporary type definition until we implement the new pricing models
type Pool = {
  id: string;
  name: string;
  // Add other fields as needed
};

export const usePools = () => {
  return useQuery({
    queryKey: ['pools'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pools')
        .select('*');
        
      if (error) throw error;
      return data as Pool[];
    }
  });
};
