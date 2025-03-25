
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useMargin = (selectedPoolId: string) => {
  // Fetch margin data
  const { data: marginData } = useQuery({
    queryKey: ["pool-margin", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_margins")
        .select("margin_percentage")
        .eq("pool_id", selectedPoolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.margin_percentage : 0;
    },
    enabled: !!selectedPoolId,
  });

  return { marginData };
};
