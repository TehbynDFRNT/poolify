
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";

interface IndividualCostsCellProps {
  poolId: string;
  column: string;
}

export const IndividualCostsCell = ({ poolId }: IndividualCostsCellProps) => {
  // Fetch the pool costs data for this pool
  const { data: poolCosts, isLoading } = useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .single();
      
      if (error) return null;
      return data;
    },
    enabled: !!poolId,
  });

  if (isLoading) return <span className="text-muted-foreground">Loading...</span>;
  
  if (!poolCosts) return <span className="text-muted-foreground">-</span>;
  
  // Calculate the total of all individual costs
  const total = 
    (poolCosts.pea_gravel || 0) + 
    (poolCosts.install_fee || 0) + 
    (poolCosts.trucked_water || 0) + 
    (poolCosts.salt_bags || 0) + 
    (poolCosts.coping_supply || 0) + 
    (poolCosts.beam || 0) + 
    (poolCosts.coping_lay || 0);
  
  return <span>{formatCurrency(total)}</span>;
};
