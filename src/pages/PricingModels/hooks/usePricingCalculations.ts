
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { initialPoolCosts, poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import type { SupabasePoolResponse } from "../types";

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
    // Calculate total fixed costs
    const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.price, 0);

    // Calculate pool specific costs
    const poolCosts = initialPoolCosts[pool.name] || {
      truckedWater: 0,
      saltBags: 0,
      copingSupply: 0,
      beam: 0,
      copingLay: 0,
      peaGravel: 0,
      installFee: 0
    };

    const digType = digTypes.find(dt => dt.name === poolDigTypeMap[pool.name]);
    const excavationCost = digType ? 
      (digType.truck_count * digType.truck_hourly_rate * digType.truck_hours) +
      (digType.excavation_hourly_rate * digType.excavation_hours) : 0;

    const totalPoolCosts = 
      poolCosts.truckedWater +
      poolCosts.saltBags +
      poolCosts.copingSupply +
      poolCosts.beam +
      poolCosts.copingLay +
      poolCosts.peaGravel +
      poolCosts.installFee +
      excavationCost;

    // Calculate filtration package total
    const calculatePackageTotal = (pkg: NonNullable<SupabasePoolResponse['standard_filtration_package']>) => {
      const handoverKitTotal = pkg.handover_kit?.components.reduce((total, comp) => {
        return total + ((comp.component?.price || 0) * comp.quantity);
      }, 0) || 0;

      return (
        (pkg.light?.price || 0) +
        (pkg.pump?.price || 0) +
        (pkg.sanitiser?.price || 0) +
        (pkg.filter?.price || 0) +
        handoverKitTotal
      );
    };

    const filtrationTotal = pool.standard_filtration_package ? 
      calculatePackageTotal(pool.standard_filtration_package) : 0;

    // Calculate pool shell price
    const poolShellPrice = pool.buy_price_inc_gst || 0;

    // Calculate true cost
    return totalFixedCosts + totalPoolCosts + filtrationTotal + poolShellPrice;
  };

  return { calculateTrueCost };
};
