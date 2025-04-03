
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CraneCost } from "@/types/crane-cost";

export const useCraneData = () => {
  // Fetch all crane costs with Franna default highlighted
  const { data: craneCosts, isLoading: isLoadingCranes } = useQuery({
    queryKey: ["crane-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      return data as CraneCost[];
    },
  });

  // Fetch pool crane selections
  const { data: craneSelections } = useQuery({
    queryKey: ["pool-crane-selections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_crane_selections")
        .select("pool_id, crane_id");
      
      if (error) throw error;
      
      // Create a map for quick lookups
      const selectionsMap = new Map();
      data.forEach(selection => {
        selectionsMap.set(selection.pool_id, selection.crane_id);
      });
      
      return selectionsMap;
    },
    enabled: !!craneCosts,
  });

  // Find the default Franna crane from the available cranes
  const defaultCrane = craneCosts?.find(crane => 
    crane.name === "Franna Crane-S20T-L1"
  );

  // Function to get crane for a specific pool
  const getCraneForPool = (poolId: string): CraneCost | undefined => {
    if (!craneCosts || !craneSelections) return defaultCrane;

    // Get the selected crane ID for this pool, or undefined if none selected
    const selectedCraneId = craneSelections.get(poolId);
    
    if (selectedCraneId) {
      // Find the crane with this ID
      return craneCosts.find(crane => crane.id === selectedCraneId);
    }
    
    // Return the default crane if no selection exists
    return defaultCrane;
  };

  // Function to get crane name for a pool
  const getCraneName = (poolId: string): string => {
    const crane = getCraneForPool(poolId);
    return crane?.name || "Not selected";
  };

  // Function to get crane cost for a pool
  const getCraneCost = (poolId: string): number => {
    const crane = getCraneForPool(poolId);
    return crane?.price || 0;
  };

  return {
    craneCosts,
    isLoadingCranes,
    craneSelections,
    getCraneForPool,
    getCraneName,
    getCraneCost,
    defaultCrane
  };
};
