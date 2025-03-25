import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CraneCost } from "@/types/crane-cost";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";

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
      return data;
    },
  });
};

// Hook to fetch individual costs for a pool
export const useIndividualCosts = (poolId: string) => {
  return useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      const { data: poolCosts } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .maybeSingle();

      return poolCosts;
    },
  });
};

// Hook to fetch excavation details for a pool
export const useExcavationDetails = (poolId: string) => {
  return useQuery({
    queryKey: ["pool-excavation", poolId],
    queryFn: async () => {
      const { data: match } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          dig_type_id,
          dig_type:dig_types (*)
        `)
        .eq("pool_id", poolId)
        .maybeSingle();

      return match;
    },
  });
};

// Hook to fetch selected crane for a pool
export const useSelectedCrane = (poolId: string) => {
  return useQuery({
    queryKey: ["selected-crane", poolId],
    queryFn: async () => {
      try {
        // First try to get the crane_id from pool_crane_selections
        const { data: selection, error: selectionError } = await supabase
          .from('pool_crane_selections')
          .select('crane_id')
          .eq('pool_id', poolId)
          .maybeSingle();
        
        if (selectionError && selectionError.code !== 'PGRST116') {
          throw selectionError;
        }

        // If a selection exists, get that crane's details
        if (selection && 'crane_id' in selection) {
          const { data: crane, error: craneError } = await supabase
            .from("crane_costs")
            .select("*")
            .eq("id", selection.crane_id)
            .single();
            
          if (craneError) throw craneError;
          return crane as CraneCost;
        }

        // Otherwise get the default Franna crane
        const { data: defaultCrane, error: defaultError } = await supabase
          .from("crane_costs")
          .select("*")
          .eq("name", "Franna Crane-S20T-L1")
          .maybeSingle();
        
        if (defaultError) throw defaultError;
        return defaultCrane as CraneCost;
      } catch (error) {
        console.error("Error fetching crane data:", error);
        
        // Fall back to default crane
        const { data: defaultCrane } = await supabase
          .from("crane_costs")
          .select("*")
          .eq("name", "Franna Crane-S20T-L1")
          .maybeSingle();
        
        return defaultCrane as CraneCost;
      }
    },
  });
};

// Hook to fetch margin data for a pool
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
  });
};

// Helper function to calculate excavation total
export const calculateExcavationTotal = (excavationDetails: any) => {
  return excavationDetails?.dig_type ? calculateGrandTotal(excavationDetails.dig_type) : 0;
};
