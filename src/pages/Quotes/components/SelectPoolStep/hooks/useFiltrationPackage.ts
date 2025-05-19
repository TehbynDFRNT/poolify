import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { useQuery } from "@tanstack/react-query";

export const useFiltrationPackage = (selectedPool: Pool | undefined, customerId?: string) => {
  // Fetch filtration package data for the selected pool
  const { data: filtrationPackage, isLoading, error } = useQuery({
    queryKey: ["filtration-package", selectedPool?.id, customerId],
    queryFn: async () => {
      if (!selectedPool?.id) return null;

      // Use the explicitly passed customerId first
      let poolProjectId = customerId;

      // If no customerId was passed, try to get it from the pool object
      if (!poolProjectId && (selectedPool as any).customer_id) {
        poolProjectId = (selectedPool as any).customer_id;
      }

      console.log("Filtration lookup - Pool ID:", selectedPool.id, "Customer ID:", poolProjectId || "none");

      // Only try to fetch from project overrides if we have a project ID
      let filtrationPackageId: string | null = null;

      if (poolProjectId) {
        console.log("Looking up filtration package override for customer ID:", poolProjectId);
        try {
          // 1. Check for a per-project override
          const { data: projectPkg, error: projectPkgError } = await supabase
            .from("pool_project_filtration_packages")
            .select("filtration_package_id")
            .eq("pool_project_id", poolProjectId)
            .single();

          if (projectPkgError) {
            if (projectPkgError.code !== 'PGRST116') { // Not found error
              console.log("Error fetching project filtration package:", projectPkgError);
            } else {
              console.log("No override found for customer ID:", poolProjectId);
            }
          } else if (projectPkg) {
            filtrationPackageId = projectPkg.filtration_package_id;
            console.log("Found project override filtration package:", filtrationPackageId);
          }
        } catch (err) {
          console.error("Error in project filtration package lookup:", err);
        }
      }

      // Fallback to default from pool spec if no override found
      if (!filtrationPackageId) {
        filtrationPackageId = selectedPool.default_filtration_package_id || null;
        console.log("Using default filtration package:", filtrationPackageId);
      }

      if (!filtrationPackageId) return null;

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
        .eq('id', filtrationPackageId)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!selectedPool?.id,
    staleTime: 0, // Ensure we always refetch when the query key changes
  });

  return { filtrationPackage, isLoading, error };
};
