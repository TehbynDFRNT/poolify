import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CraneCost } from "@/types/crane-cost";

export const useCrane = (selectedPoolId: string) => {
  // Fetch all crane costs and Franna default
  const { data: craneCosts } = useQuery({
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

  // Find the default Franna crane
  const defaultCrane = craneCosts?.find(crane => crane.name === "Franna Crane-S20T-L1");

  // Fetch crane selection for the selected pool
  const { data: selectedCrane } = useQuery({
    queryKey: ["crane-selection", selectedPoolId],
    queryFn: async () => {
      if (!selectedPoolId) return null;
      
      try {
        const { data, error } = await supabase
          .from("pool_crane_selections")
          .select(`
            crane:crane_costs (*)
          `)
          .eq('pool_id', selectedPoolId)
          .maybeSingle();
        
        if (error && error.code !== 'PGRST116') throw error;
        
        // If we have a crane selection, return the crane details
        if (data?.crane) {
          return data.crane;
        }
        
        // Otherwise return the default crane
        return defaultCrane;
      } catch (error) {
        console.error('Error fetching crane selection:', error);
        return defaultCrane;
      }
    },
    enabled: !!selectedPoolId && !!craneCosts,
  });

  // Calculate crane cost - ensure we convert to number
  const getCraneCost = () => {
    return selectedCrane ? Number(selectedCrane.price) || 0 : 0;
  };

  return {
    selectedCrane,
    getCraneCost
  };
};
