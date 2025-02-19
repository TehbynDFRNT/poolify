
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FiltrationComponent, FiltrationComponentType, PackageWithComponents } from "@/types/filtration";

export const useFiltrationQueries = (selectedTypeId: string | null) => {
  const { data: componentTypes } = useQuery({
    queryKey: ["filtration-component-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_component_types")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as FiltrationComponentType[];
    },
  });

  const { data: components } = useQuery({
    queryKey: ["filtration-components", selectedTypeId],
    queryFn: async () => {
      let query = supabase
        .from("filtration_components")
        .select("*")
        .order("name");

      if (selectedTypeId) {
        query = query.eq("type_id", selectedTypeId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FiltrationComponent[];
    },
  });

  const { data: handoverKits } = useQuery({
    queryKey: ["handover-kits"],
    queryFn: async () => {
      const handoverKitType = componentTypes?.find(t => t.name === "Handover Kit");
      
      if (!handoverKitType) {
        console.log("Handover Kit type not found");
        return [];
      }

      const { data, error } = await supabase
        .from("filtration_components")
        .select("*")
        .eq("type_id", handoverKitType.id)
        .order("name");

      if (error) {
        console.error("Error fetching handover kits:", error);
        throw error;
      }

      return data as FiltrationComponent[];
    },
    enabled: !!componentTypes,
  });

  const { data: packages, isLoading: isLoadingPackages } = useQuery({
    queryKey: ["filtration-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          name,
          display_order,
          created_at,
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
        .order("display_order");

      if (error) throw error;
      
      const transformedData: PackageWithComponents[] = (data || []).map(pkg => ({
        id: pkg.id,
        name: pkg.name,
        display_order: pkg.display_order,
        light: pkg.light,
        pump: pkg.pump,
        sanitiser: pkg.sanitiser,
        filter: pkg.filter,
        handover_kit: pkg.handover_kit ? {
          id: pkg.handover_kit.id,
          name: pkg.handover_kit.name,
          components: pkg.handover_kit.components
        } : null
      }));

      return transformedData;
    },
  });

  return {
    componentTypes,
    components,
    handoverKits,
    packages,
    isLoadingPackages,
  };
};
