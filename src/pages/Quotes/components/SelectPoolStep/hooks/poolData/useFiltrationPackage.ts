
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFiltrationPackage = (filtrationPackageId?: string) => {
  return useQuery({
    queryKey: ["filtration-package", filtrationPackageId],
    queryFn: async () => {
      if (!filtrationPackageId) return null;

      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          light:filtration_components!light_id (
            id, name, model_number, price
          ),
          pump:filtration_components!pump_id (
            id, name, model_number, price
          ),
          sanitiser:filtration_components!sanitiser_id (
            id, name, model_number, price
          ),
          filter:filtration_components!filter_id (
            id, name, model_number, price
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
                price
              )
            )
          )
        `)
        .eq('id', filtrationPackageId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!filtrationPackageId,
  });
};
