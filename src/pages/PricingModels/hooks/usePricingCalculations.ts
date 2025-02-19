
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { initialPoolCosts, poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import type { SupabasePoolResponse } from "../types";
import { 
  calculateFiltrationTotal,
  calculatePoolSpecificCosts,
  calculateFixedCostsTotal
} from "../utils/calculateCosts";

export const usePricingCalculations = () => {
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
    // Get dig type for the pool
    const digType = digTypes.find(dt => dt.name === poolDigTypeMap[pool.name]);
    
    // Calculate individual components
    const poolShellPrice = pool.buy_price_inc_gst || 0;
    const filtrationTotal = calculateFiltrationTotal(pool.standard_filtration_package);
    const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType);
    const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);

    console.log('Cost breakdown for', pool.name, {
      poolShellPrice,
      filtrationTotal,
      totalPoolCosts,
      totalFixedCosts,
      total: poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts
    });

    // Calculate true cost
    return poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;
  };

  return { calculateTrueCost };
};
