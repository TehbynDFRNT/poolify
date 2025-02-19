
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

const fetchFiltrationPackages = async () => {
  const { data, error } = await supabase
    .from("filtration_packages")
    .select(`
      *,
      light:filtration_components!light_id(id, name, model_number, price),
      pump:filtration_components!pump_id(id, name, model_number, price),
      sanitiser:filtration_components!sanitiser_id(id, name, model_number, price),
      filter:filtration_components!filter_id(id, name, model_number, price),
      handover_kit:handover_kit_packages!handover_kit_id(
        id, 
        name,
        components:handover_kit_package_components(
          id,
          quantity,
          component:filtration_components(
            id,
            name,
            model_number,
            price
          )
        )
      )
    `);

  if (error) throw error;
  return data;
};

export const usePricingCalculations = () => {
  // All queries defined at the top level of the hook
  const { data: fixedCosts = [] } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: fetchFixedCosts,
  });

  const { data: digTypes = [] } = useQuery({
    queryKey: ["excavation-dig-types"],
    queryFn: fetchDigTypes,
  });

  const { data: filtrationPackages = [] } = useQuery({
    queryKey: ["filtration-packages"],
    queryFn: fetchFiltrationPackages,
  });

  const calculateTrueCost = (pool: SupabasePoolResponse) => {
    // Get the correct dig type for this pool
    const digType = digTypes.find(dt => dt.name === poolDigTypeMap[pool.name]) || null;
    
    const poolShellPrice = pool.buy_price_inc_gst || 0;
    const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType);
    const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);

    // Get the correct filtration package for this pool
    const filtrationPackage = filtrationPackages.find(fp => fp.id === pool.standard_filtration_package_id);
    const filtrationTotal = calculateFiltrationTotal(filtrationPackage);
    
    console.log('Cost breakdown for', pool.name, {
      poolShellPrice,
      filtrationTotal,
      totalPoolCosts,
      totalFixedCosts,
      total: poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts
    });
    
    return poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;
  };

  return { calculateTrueCost };
};
