
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

      // Find the individual cost for this pool's range and name
      const { data: costs } = await supabase
        .from("pool_individual_costs")
        .select("cost_value")
        .eq("range", pool.range)
        .eq("name", pool.name);

      // If cost found, return it, otherwise return 0
      return costs && costs.length > 0 ? costs[0].cost_value : 0;
    },
    enabled: !!poolId && column === "individual_costs"
  });

  if (isLoading) return <span className="text-gray-400">Loading...</span>;

  // Format and display just the dollar value
  return <>{formatCurrency(data || 0)}</>;
};
