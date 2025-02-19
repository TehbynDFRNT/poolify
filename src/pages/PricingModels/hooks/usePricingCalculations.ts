
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

  const calculateTrueCost = (pool: SupabasePoolResponse) => {
    const poolShellPrice = pool.buy_price_inc_gst || 0;
    const filtrationTotal = calculateFiltrationTotal(pool.standard_filtration_package);
    const totalPoolCosts = calculatePoolSpecificCosts(pool.name);
    const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);
    
    return poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;
  };

  return { calculateTrueCost };
};
