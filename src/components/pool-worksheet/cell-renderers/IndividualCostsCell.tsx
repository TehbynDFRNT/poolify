
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";

interface IndividualCostsCellProps {
  poolId: string;
  column: string;
}

export const IndividualCostsCell = ({ poolId, column }: IndividualCostsCellProps) => {
  // Query pool individual costs data for the specified pool
  const { data, isLoading } = useQuery({
    queryKey: ["pool-individual-costs", poolId],
    queryFn: async () => {
      // Get the individual costs for this pool model and range
      const { data: pool } = await supabase
        .from("pool_specifications")
        .select("name, range")
        .eq("id", poolId)
        .single();

      if (!pool) return 0;

      console.log(`Fetching individual costs for pool: ${pool.name}, range: ${pool.range}`);
      
      // Find the individual cost for this pool's range and name
      const { data: costs, error } = await supabase
        .from("pool_individual_costs")
        .select("*")
        .eq("range", pool.range)
        .eq("name", pool.name);
      
      if (error) {
        console.error("Error fetching individual costs:", error);
        return 0;
      }

      console.log("Found costs:", costs);
      
      // If cost found, return it, otherwise return 0
      if (costs && costs.length > 0) {
        return costs[0].cost_value;
      } else {
        // Try without exact name match - just use range and check if name includes the pool name
        // This is helpful when pool name in specifications might be slightly different from the name in costs
        const { data: alternativeCosts, error: altError } = await supabase
          .from("pool_individual_costs")
          .select("*")
          .eq("range", pool.range);
          
        if (altError) {
          console.error("Error fetching alternative costs:", altError);
          return 0;
        }
        
        console.log("Alternative costs by range:", alternativeCosts);
        
        // Find a match where the cost name includes the pool name (case insensitive)
        const matchingCost = alternativeCosts?.find(cost => 
          cost.name.toLowerCase().includes(pool.name.toLowerCase()) || 
          pool.name.toLowerCase().includes(cost.name.toLowerCase())
        );
        
        return matchingCost ? matchingCost.cost_value : 0;
      }
    },
    enabled: !!poolId && column === "individual_costs"
  });

  if (isLoading) return <span className="text-gray-400">Loading...</span>;

  // Format and display just the dollar value
  return <>{formatCurrency(data || 0)}</>;
};
