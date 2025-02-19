
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupabasePoolResponse } from "../types";
import { poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import { 
  calculateFiltrationTotal,
  calculatePoolSpecificCosts,
  calculateFixedCostsTotal
} from "../utils/calculateCosts";

// Query functions moved outside the hook
const fetchFixedCosts = async () => {
  const { data, error } = await supabase
    .from("fixed_costs")
    .select("*")
    .order('display_order');

  if (error) throw error;
  return data;
};

const fetchDigTypes = async () => {
  const { data, error } = await supabase
    .from("excavation_dig_types")
    .select("*");

  if (error) throw error;
  return data;
};

export const usePricingCalculations = () => {
  const { data: fixedCosts = [], isLoading: isLoadingFixedCosts } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: fetchFixedCosts,
  });

  const { data: digTypes = [], isLoading: isLoadingDigTypes } = useQuery({
    queryKey: ["excavation-dig-types"],
    queryFn: fetchDigTypes,
  });

  const calculateTrueCost = (pool: SupabasePoolResponse) => {
    // Use the pool's buy price (shell price)
    const poolShellPrice = pool.buy_price_inc_gst || 0;
    
    // Calculate fixed costs total
    const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);
    
    // Get the dig type for pool specific costs calculation
    const digType = digTypes.find(dt => dt.name === poolDigTypeMap[pool.name]);
    const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType || null);
    
    // Calculate filtration package total
    const filtrationTotal = calculateFiltrationTotal(pool.standard_filtration_package);
    
    // Calculate total
    const total = poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;
    
    return total;
  };

  return { 
    calculateTrueCost,
    isLoading: isLoadingFixedCosts || isLoadingDigTypes
  };
};
