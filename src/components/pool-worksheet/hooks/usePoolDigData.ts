
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const usePoolDigData = () => {
  const { data: poolDigMatches } = useQuery({
    queryKey: ["pool-dig-type-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          id,
          pool_id,
          dig_type_id,
          dig_type:dig_types(*)
        `);
      
      if (error) throw error;
      
      const matchesMap = new Map();
      data?.forEach(match => {
        matchesMap.set(match.pool_id, match);
      });
      
      return matchesMap;
    }
  });

  // Calculate excavation cost for a pool
  const calculateExcavationCost = (poolId: string) => {
    const match = poolDigMatches?.get(poolId);
    if (!match || !match.dig_type) return 0;
    
    const digType = match.dig_type;
    const excavationCost = (digType.excavation_hours * digType.excavation_hourly_rate) +
                            (digType.truck_quantity * digType.truck_hours * digType.truck_hourly_rate);
    
    return excavationCost;
  };

  // Get dig type name for a pool
  const getDigTypeName = (poolId: string) => {
    const match = poolDigMatches?.get(poolId);
    return match?.dig_type?.name || '-';
  };

  return {
    poolDigMatches,
    calculateExcavationCost,
    getDigTypeName
  };
};
