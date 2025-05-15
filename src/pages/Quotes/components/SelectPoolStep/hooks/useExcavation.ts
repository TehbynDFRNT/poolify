
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DigType } from "@/types/dig-type";

export const useExcavation = (selectedPoolId: string | undefined) => {
  // Fetch excavation details for the selected pool
  const { data: excavationDetails, isLoading, error } = useQuery({
    queryKey: ["excavation", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;

      // First get the dig_type_id from the pool specification
      const { data: pool, error: poolError } = await supabase
        .from("pool_specifications")
        .select("dig_type_id")
        .eq("id", selectedPoolId)
        .single();

      if (poolError) throw poolError;

      if (!pool.dig_type_id) return null;

      // Fetch the dig type details
      const { data: digType, error: digTypeError } = await supabase
        .from("dig_types")
        .select("*")
        .eq("id", pool.dig_type_id)
        .single();

      if (digTypeError) throw digTypeError;

      // Calculate excavation price
      const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
      const truckCost = digType.truck_hourly_rate * digType.truck_hours * digType.truck_quantity;
      const totalPrice = excavationCost + truckCost;

      return {
        ...digType as DigType,
        price: totalPrice.toString()
      };
    },
    enabled: !!selectedPoolId,
  });

  return { excavationDetails, isLoading, error };
};
