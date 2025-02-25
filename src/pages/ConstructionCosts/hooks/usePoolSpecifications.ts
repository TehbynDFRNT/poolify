
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { Pool } from "@/types/pool";

export const usePoolSpecifications = () => {
  return useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      try {
        console.log('Starting pool specifications fetch');
        
        // First get the ranges for sorting
        const { data: ranges, error: rangesError } = await supabase
          .from("pool_ranges")
          .select("name")
          .order("display_order");

        if (rangesError) {
          console.error('Error fetching ranges:', rangesError);
          throw rangesError;
        }

        // Then get pools with all necessary data
        const { data: poolsData, error: poolsError } = await supabase
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

        if (poolsError) {
          console.error('Error fetching pools:', poolsError);
          throw poolsError;
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

        console.log(`Successfully fetched ${sortedPools.length} pools`);
        return sortedPools as Pool[];
      } catch (error) {
        console.error('Error in usePoolSpecifications:', error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to load pool specifications");
      }
    },
    retry: 2
  });
};
