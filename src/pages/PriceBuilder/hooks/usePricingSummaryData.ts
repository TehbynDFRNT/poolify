
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Helper function to calculate excavation total
export const calculateExcavationTotal = (excavationDetails: any) => {
  if (!excavationDetails) return 0;
  
  return (
    excavationDetails.excavation_hourly_rate * excavationDetails.excavation_hours +
    excavationDetails.truck_hourly_rate * excavationDetails.truck_hours * excavationDetails.truck_quantity
  );
};

// Hook to fetch fixed costs
export const useFixedCosts = () => {
  return useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      console.info("Fixed costs total:", data?.reduce((sum, cost) => sum + cost.price, 0));
      return data;
    },
  });
};

// Hook to fetch individual costs for a specific pool
export const useIndividualCosts = (poolId: string) => {
  return useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!poolId,
  });
};

// Hook to fetch excavation details for a specific pool
export const useExcavationDetails = (poolId: string) => {
  return useQuery({
    queryKey: ["pool-excavation", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          dig_type:dig_types (*)
        `)
        .eq("pool_id", poolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.dig_type;
    },
    enabled: !!poolId,
  });
};

// Hook to fetch selected crane data for a specific pool
export const useSelectedCrane = (poolId: string) => {
  return useQuery({
    queryKey: ["pool-crane", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_crane_selections")
        .select(`
          crane:crane_costs (*)
        `)
        .eq("pool_id", poolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data?.crane;
    },
    enabled: !!poolId,
  });
};

// Hook to fetch margin data for a specific pool
export const useMarginData = (poolId: string) => {
  return useQuery({
    queryKey: ["pool-margin", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_margins")
        .select("margin_percentage")
        .eq("pool_id", poolId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data ? data.margin_percentage : 0;
    },
    enabled: !!poolId,
  });
};
