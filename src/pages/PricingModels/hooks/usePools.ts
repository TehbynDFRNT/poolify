
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SupabasePoolResponse } from "../types";

const DEFAULT_PACKAGE_MAPPING: Record<string, number> = {
  "Latina": 1,
  "Sovereign": 1,
  "Empire": 1,
  "Oxford": 1,
  "Sheffield": 1,
  "Avellino": 1,
  "Palazzo": 1,
  "Valentina": 2,
  "Westminster": 2,
  "Kensington": 3,
  "Bedarra": 1,
  "Hayman": 1,
  "Verona": 1,
  "Portofino": 1,
  "Florentina": 1,
  "Bellagio": 1,
  "Bellino": 1,
  "Imperial": 1,
  "Castello": 1,
  "Grandeur": 1,
  "Amalfi": 1,
  "Serenity": 1,
  "Allure": 1,
  "Harmony": 1,
  "Istana": 1,
  "Terazza": 1,
  "Elysian": 1,
  "Infinity 3": 1,
  "Infinity 4": 1,
  "Terrace 3": 1,
};

export const usePools = () => {
  return useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      // First get all filtration packages
      const { data: packages } = await supabase
        .from("filtration_packages")
        .select(`
          id,
          display_order,
          light:light_id(id, name, model_number, price),
          pump:pump_id(id, name, model_number, price),
          sanitiser:sanitiser_id(id, name, model_number, price),
          filter:filter_id(id, name, model_number, price),
          handover_kit:handover_kit_id(
            id,
            name,
            components:handover_kit_package_components(
              quantity,
              component:component_id(id, name, model_number, price)
            )
          )
        `);

      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select("*");

      if (error) throw error;

      // Map pools to their default filtration packages
      const poolsWithPackages = poolsData?.map(pool => ({
        ...pool,
        standard_filtration_package: packages?.find(pkg => 
          pkg.display_order === DEFAULT_PACKAGE_MAPPING[pool.name]
        )
      }));

      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsWithPackages as unknown as SupabasePoolResponse[] || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      });
    },
  });
};
