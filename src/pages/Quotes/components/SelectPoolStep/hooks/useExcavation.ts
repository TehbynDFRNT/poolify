import { supabase } from "@/integrations/supabase/client";
import { DigType } from "@/types/dig-type";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { useQuery } from "@tanstack/react-query";

export const useExcavation = (selectedPoolId: string | undefined) => {
  // Fetch excavation details for the selected pool
  const { data: excavationDetails, isLoading, error } = useQuery({
    queryKey: ["excavation", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;

      try {
        // 1. Find the dig_type_id for this pool from pool_dig_type_matches
        const { data: match, error: matchError } = await supabase
          .from("pool_dig_type_matches")
          .select("dig_type_id")
          .eq("pool_id", selectedPoolId)
          .maybeSingle();

        if (matchError) {
          console.error("Error fetching pool_dig_type_match:", matchError);
          return await getDefaultDigType(null, null, null);
        }

        const digTypeId = match?.dig_type_id;
        if (digTypeId) {
          // 2. Fetch the dig type details
          const { data: digType, error: digTypeError } = await supabase
            .from("dig_types")
            .select("*")
            .eq("id", digTypeId)
            .single();

          if (digTypeError || !digType) {
            console.error("Error fetching dig type:", digTypeError);
            return await getDefaultDigType(null, null, null);
          }

          // Always use the calculated value for price
          const price = calculateGrandTotal(digType).toString();

          return {
            ...digType as DigType,
            price
          };
        } else {
          // No dig type match found, fallback
          console.log("No dig_type_id found in pool_dig_type_matches, using default");
          return await getDefaultDigType(null, null, null);
        }
      } catch (err) {
        console.error("Unexpected error in useExcavation:", err);
        return await getDefaultDigType(null, null, null);
      }
    },
    enabled: !!selectedPoolId,
  });

  // Function to get a default dig type from Supabase
  const getDefaultDigType = async (
    poolName: string | null,
    poolRange: string | null,
    poolTypeId: string | null
  ): Promise<DigType & { price: string }> => {
    try {
      // Try to get a sensible name for the pool
      const displayName = poolName || poolRange || "Standard Pool";

      console.log(`Looking for default excavation for ${displayName}`);

      // First try to find a dig type specific to this pool's type
      if (poolTypeId) {
        console.log(`Checking for excavation defaults for pool type ID: ${poolTypeId}`);
        const { data: typeSpecificDefaults } = await supabase
          .from("dig_types")
          .select("*")
          .eq("pool_type_id", poolTypeId)
          .eq("is_default", true)
          .maybeSingle();

        if (typeSpecificDefaults) {
          console.log("Found type-specific default excavation data:", typeSpecificDefaults);
          const price = calculateGrandTotal(typeSpecificDefaults).toString();
          return {
            ...typeSpecificDefaults as DigType,
            price
          };
        }
      }

      // Next, try to find a general default dig type
      console.log("Looking for general default excavation data");
      const { data: generalDefault } = await supabase
        .from("dig_types")
        .select("*")
        .eq("is_default", true)
        .maybeSingle();

      if (generalDefault) {
        console.log("Found general default excavation data:", generalDefault);
        const price = calculateGrandTotal(generalDefault).toString();
        return {
          ...generalDefault as DigType,
          price
        };
      }

      // If nothing is found, try getting any dig type to use as a default
      console.log("No default flags found, fetching any dig type to use as default");
      const { data: anyDigType } = await supabase
        .from("dig_types")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (anyDigType) {
        console.log("Using a random dig type as default:", anyDigType);
        const price = calculateGrandTotal(anyDigType).toString();
        return {
          ...anyDigType as DigType,
          name: `Standard Excavation for ${displayName}`,
          price
        };
      }

      // If all database lookups fail, use hardcoded values as a last resort
      console.log("No excavation data found in database, using hardcoded values");
      const fallback: DigType = {
        id: "default",
        name: `Standard Excavation for ${displayName}`,
        truck_quantity: 1,
        truck_hourly_rate: 110,
        truck_hours: 4,
        excavation_hourly_rate: 150,
        excavation_hours: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return {
        ...fallback,
        price: calculateGrandTotal(fallback).toString()
      };
    } catch (error) {
      console.error("Error fetching default excavation data:", error);
      const fallback: DigType = {
        id: "default",
        name: `Standard Excavation`,
        truck_quantity: 1,
        truck_hourly_rate: 110,
        truck_hours: 4,
        excavation_hourly_rate: 150,
        excavation_hours: 8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return {
        ...fallback,
        price: calculateGrandTotal(fallback).toString()
      };
    }
  };

  return { excavationDetails, isLoading, error };
};
