
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const usePoolData = (poolId: string) => {
  return useQuery({
    queryKey: ["pool", poolId],
    queryFn: async () => {
      try {
        console.log('Fetching individual pool data for:', poolId);
        
        const { data: pool, error } = await supabase
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
          `)
          .eq('id', poolId)
          .single();

        if (error) {
          console.error('Error fetching pool:', error);
          throw error;
        }

        if (!pool) {
          throw new Error('Pool not found');
        }

        console.log('Successfully fetched pool:', pool.name);
        return pool;
      } catch (error) {
        console.error('Error in usePoolData:', error);
        throw error;
      }
    },
    meta: {
      onError: (error: Error) => {
        toast.error("Failed to load pool details");
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });
};
