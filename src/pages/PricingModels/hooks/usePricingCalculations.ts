
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
          component:component_id(id, name, model_number, price)
        )
      )
    `);

  if (error) throw error;
  return data;
};

export const usePricingCalculations = () => {
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
    // Use the pool's buy price (shell price)
    const poolShellPrice = pool.buy_price_ex_gst || 0;
    
    // Calculate fixed costs total
    const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);
    
    // Get the dig type for pool specific costs calculation
    const digType = digTypes.find(dt => dt.name === pool.dig_level);
    const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType || null);
    
    // Calculate filtration package total
    const filtrationPackage = pool.standard_filtration_package;
    const filtrationTotal = calculateFiltrationTotal(filtrationPackage);
    
    // Calculate total
    const total = poolShellPrice + filtrationTotal + totalPoolCosts + totalFixedCosts;
    
    console.log(`Calculating for ${pool.name}:`, {
      poolShellPrice,
      totalFixedCosts,
      totalPoolCosts,
      filtrationTotal,
      total
    });
    
    return total;
  };

  return { calculateTrueCost };
};
