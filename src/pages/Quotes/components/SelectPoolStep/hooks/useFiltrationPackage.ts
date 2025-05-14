
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";

export const useFiltrationPackage = (selectedPool: Pool | undefined) => {
  // Fetch filtration package data for the selected pool
  const { data: filtrationPackage, isLoading, error } = useQuery({
    queryKey: ["filtration-package", selectedPool?.default_filtration_package_id],
    queryFn: async () => {
      if (!selectedPool?.default_filtration_package_id) return null;

      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          light:filtration_components!light_id (
            id, name, model_number, price_inc_gst
          ),
          pump:filtration_components!pump_id (
            id, name, model_number, price_inc_gst
          ),
          sanitiser:filtration_components!sanitiser_id (
            id, name, model_number, price_inc_gst
          ),
          filter:filtration_components!filter_id (
            id, name, model_number, price_inc_gst
          ),
          handover_kit:handover_kit_packages!handover_kit_id (
            id, 
            name,
            components:handover_kit_package_components (
              id,
              quantity,
              package_id,
              component_id,
              created_at,
              component:filtration_components!component_id (
                id,
                name,
                model_number,
                price_inc_gst
              )
            )
          )
        `)
        .eq('id', selectedPool.default_filtration_package_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedPool?.default_filtration_package_id,
    staleTime: 0, // Ensure we always refetch when the query key changes
  });

  return { filtrationPackage, isLoading, error };
};
