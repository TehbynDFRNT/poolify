
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { calculatePackagePrice } from "@/utils/package-calculations";
import { toast } from "sonner";

export const usePriceBuilderData = () => {
  // Fetch pools with ranges for sorting
  const { data: pools, isLoading: isLoadingPools } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      try {
        console.log('Starting price builder data fetch');
        
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

        if (error) {
          console.error('Error fetching pools:', error);
          throw error;
        }

        if (!poolsData) {
          console.log('No pool data returned');
          return [];
        }

        const rangeOrder = ranges?.map(r => r.name) || [];
        const sortedPools = poolsData.sort((a, b) => {
          const aIndex = rangeOrder.indexOf(a.range);
          const bIndex = rangeOrder.indexOf(b.range);
          return aIndex - bIndex;
        });

        console.log(`Successfully fetched ${sortedPools.length} pools in price builder`);
        return sortedPools;
      } catch (error) {
        console.error('Error fetching price builder data:', error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to load pool data");
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  // Fetch fixed costs
  const { data: fixedCosts, isLoading: isLoadingFixed } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) {
        console.error('Error fetching fixed costs:', error);
        throw error;
      }
      return data || [];
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  // Fetch pool costs
  const { data: poolCosts, isLoading: isLoadingCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*");
      
      if (error) {
        console.error('Error fetching pool costs:', error);
        throw error;
      }
      
      const costsMap = new Map();
      (data || []).forEach(cost => {
        costsMap.set(cost.pool_id, cost);
      });
      
      return costsMap;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
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

      if (error) {
        console.error('Error fetching excavation details:', error);
        throw error;
      }

      const excavationMap = new Map();
      (data || []).forEach(match => {
        excavationMap.set(match.pool_id, match.dig_type);
      });

      return excavationMap;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  });

  const isLoading = isLoadingPools || isLoadingFixed || isLoadingCosts || isLoadingExcavation;

  return {
    pools,
    fixedCosts,
    poolCosts,
    excavationDetails,
    isLoading
  };
};
