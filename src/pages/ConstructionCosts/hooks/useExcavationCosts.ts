
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ExcavationDigType } from "@/types/excavation-dig-type";

const calculateDigCost = (digType: ExcavationDigType) => {
  const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
  const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
  return truckCost + excavationCost;
};

export const useExcavationCosts = () => {
  const { data: excavationData } = useQuery({
    queryKey: ["pool-excavation-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_excavation_types")
        .select(`
          *,
          dig_type:excavation_dig_types(*)
        `);
      
      if (error) throw error;
      return data;
    }
  });

  const excavationCosts = new Map();
  excavationData?.forEach(excavation => {
    if (excavation.dig_type) {
      excavationCosts.set(excavation.name, calculateDigCost(excavation.dig_type));
    }
  });

  return excavationCosts;
};
