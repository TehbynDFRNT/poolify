import { supabase } from "@/integrations/supabase/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePoolPackages = () => {
  const queryClient = useQueryClient();

  const { data: poolsWithPackages, isLoading } = useQuery({
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
                quantity,
                component:filtration_components!component_id (
                  id, name, model_number, price_inc_gst
                )
              )
            )
          )
        `)
        .order("range", { ascending: true })
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching pools:", error);
        throw error;
      }

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
      // Upsert into pool_project_filtration_packages
      const { error } = await supabase
        .from("pool_project_filtration_packages")
        .upsert([
          {
            pool_project_id: poolId,
            filtration_package_id: packageId,
            updated_at: new Date().toISOString(),
          },
        ], { onConflict: ["pool_project_id"] });

      if (error) {
        console.error("Error updating pool project filtration package:", error);
        throw error;
      }
    },
    onSuccess: (_, variables) => {
      // Invalidate queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["pools-with-packages"] });
      queryClient.invalidateQueries({ queryKey: ["filtration-package", variables.packageId] });
      queryClient.invalidateQueries({ queryKey: ["pool", variables.poolId] });

      toast.success("Package updated successfully");
    },
    onError: (error) => {
      console.error("Mutation error:", error);
      toast.error("Failed to update package");
    },
  });

  return {
    poolsWithPackages,
    isLoading,
    updatePoolPackageMutation,
  };
};
