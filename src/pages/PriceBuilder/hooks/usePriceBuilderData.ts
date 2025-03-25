
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { calculatePackagePrice } from "@/utils/package-calculations";

export const usePriceBuilderData = () => {
  // Fetch pools with ranges for sorting
  const { data: pools, isLoading: isLoadingPools } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          default_filtration_package:filtration_packages!pool_specifications_default_filtration_package_id_fkey (
            id,
            name,
            light:filtration_components!filtration_packages_light_id_fkey (id, name, model_number, price),
            pump:filtration_components!filtration_packages_pump_id_fkey (id, name, model_number, price),
            sanitiser:filtration_components!filtration_packages_sanitiser_id_fkey (id, name, model_number, price),
            filter:filtration_components!filtration_packages_filter_id_fkey (id, name, model_number, price),
            handover_kit:handover_kit_packages (
              id,
              name,
              components:handover_kit_package_components (
                quantity,
                component:filtration_components (id, name, model_number, price)
              )
            )
          )
        `);

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      });
    },
  });

  // Fetch fixed costs
  const { data: fixedCosts, isLoading: isLoadingFixed } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data;
    },
  });

  // Fetch pool costs
  const { data: poolCosts, isLoading: isLoadingCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*");
      
      if (error) throw error;
      
      const costsMap = new Map();
      data?.forEach(cost => {
        costsMap.set(cost.pool_id, cost);
      });
      
      return costsMap;
    }
  });

  // Fetch excavation details
  const { data: excavationDetails, isLoading: isLoadingExcavation } = useQuery({
    queryKey: ["pool-excavation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          pool_id,
          dig_type:dig_types (*)
        `);

      if (error) throw error;

      const excavationMap = new Map();
      data?.forEach(match => {
        excavationMap.set(match.pool_id, match.dig_type);
      });

      return excavationMap;
    },
  });

  // Fetch all crane costs first
  const { data: allCraneCosts, isLoading: isLoadingAllCraneCosts } = useQuery({
    queryKey: ["all-crane-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data;
    }
  });

  // Find the default Franna crane
  const defaultCrane = allCraneCosts?.find(crane => crane.name === "Franna Crane-S20T-L1");

  // Fetch crane selections with improved error handling
  const { data: craneSelections, isLoading: isLoadingCranes } = useQuery({
    queryKey: ["pool-crane-selections"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("pool_crane_selections")
          .select(`
            pool_id,
            crane:crane_costs (*)
          `);

        if (error) throw error;

        // Create a Map of pool_id to crane cost
        const craneMap = new Map();
        
        // If we have pool data but no crane selections yet, we should add default cranes
        if (pools && defaultCrane) {
          pools.forEach(pool => {
            // Default to Franna Crane if no selection exists
            craneMap.set(pool.id, defaultCrane);
          });
        }
        
        // Then overlay any specific selections from the database
        data?.forEach(selection => {
          if (selection.crane) {
            craneMap.set(selection.pool_id, selection.crane);
          }
        });

        return craneMap;
      } catch (error) {
        console.error("Error fetching crane selections:", error);
        
        // Still provide default cranes if the query fails
        const craneMap = new Map();
        if (pools && defaultCrane) {
          pools.forEach(pool => {
            craneMap.set(pool.id, defaultCrane);
          });
        }
        return craneMap;
      }
    },
    enabled: !!pools && !!allCraneCosts,
  });

  const isLoading = isLoadingPools || isLoadingFixed || isLoadingCosts || isLoadingExcavation || isLoadingCranes || isLoadingAllCraneCosts;

  return {
    pools,
    fixedCosts,
    poolCosts,
    excavationDetails,
    craneSelections,
    isLoading
  };
};
