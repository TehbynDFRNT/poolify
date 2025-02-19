
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupabasePoolResponse } from "../types";

export const usePools = () => {
  return useQuery({
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
          standard_filtration_package: standard_filtration_package_id (
            id,
            name,
            display_order,
            created_at,
            light: light_id ( id, name, model_number, price ),
            pump: pump_id ( id, name, model_number, price ),
            sanitiser: sanitiser_id ( id, name, model_number, price ),
            filter: filter_id ( id, name, model_number, price ),
            handover_kit: handover_kit_id (
              id,
              name,
              components: handover_kit_package_components (
                quantity,
                component: component_id ( id, name, model_number, price )
              )
            )
          )
        `);

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData as unknown as SupabasePoolResponse[] || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      });
    },
  });
};
