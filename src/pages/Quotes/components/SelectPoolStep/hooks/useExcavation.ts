
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";

export const useExcavation = (selectedPoolId: string) => {
  // Fetch excavation data for the selected pool
  const { data: excavationDetails } = useQuery({
    queryKey: ["pool-excavation", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          pool_id,
          dig_type:dig_types (*)
        `)
        .eq('pool_id', selectedPoolId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.dig_type;
    },
    enabled: !!selectedPoolId,
  });

  // Calculate excavation cost
  const getExcavationCost = () => {
    return excavationDetails ? calculateGrandTotal(excavationDetails) : 0;
  };

  return {
    excavationDetails,
    getExcavationCost
  };
};
