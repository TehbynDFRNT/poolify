
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupabasePoolResponse } from "../types";
import { poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import { 
  calculateFiltrationTotal,
  calculatePoolSpecificCosts,
  calculateFixedCostsTotal
} from "../utils/calculateCosts";

export const usePricingCalculations = () => {
  // Fetch fixed costs
  const { data: fixedCosts = [] } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });

  // Fetch dig types
  const { data: digTypes = [] } = useQuery({
    queryKey: ["excavation-dig-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*");

      if (error) throw error;
      return data;
    },
  });

  const calculateTrueCost = (pool: SupabasePoolResponse) => {
    // Get the correct dig type for this pool
    const digType = digTypes.find(dt => dt.name === poolDigTypeMap[pool.name]) || null;
    
    const poolShellPrice = pool.buy_price_inc_gst || 0;
    const filtrationTotal = calculateFiltrationTotal(pool.standard_filtration_package);
    const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType);
    const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);
    
    return poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;
  };

  return { calculateTrueCost };
};
