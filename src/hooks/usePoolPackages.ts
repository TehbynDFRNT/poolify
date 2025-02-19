
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { PackageWithComponents } from "@/types/filtration";

export const usePoolPackages = () => {
  const queryClient = useQueryClient();

  const { data: poolsWithPackages } = useQuery({
    queryKey: ["pools-with-packages"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select(`
          id, 
          name, 
          range,
          default_filtration_package_id,
          default_package:filtration_packages!default_filtration_package_id (
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
                quantity,
                component:filtration_components!component_id (
                  id, name, model_number, price
                )
              )
            )
          )
        `)
        .order("range", { ascending: true })
        .order("name", { ascending: true });

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      });
    },
  });

  const updatePoolPackageMutation = useMutation({
    mutationFn: async ({ poolId, packageId }: { poolId: string; packageId: string }) => {
      const { error } = await supabase
        .from("pool_specifications")
        .update({ default_filtration_package_id: packageId })
        .eq("id", poolId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pools-with-packages"] });
    },
  });

  return {
    poolsWithPackages,
    updatePoolPackageMutation,
  };
};
