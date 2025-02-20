
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";

interface PoolIndividualCostsDetailsProps {
  poolId: string;
}

export const PoolIndividualCostsDetails = ({ poolId }: PoolIndividualCostsDetailsProps) => {
  const { data: costs, isLoading } = useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      console.log("Fetching costs for pool:", poolId);
      
      // Get the pool costs first
      const { data: poolCosts, error: costsError } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .maybeSingle();

      if (costsError) {
        console.error("Error fetching costs:", costsError);
        throw costsError;
      }

      if (!poolCosts) {
        return {
          pea_gravel: 0,
          install_fee: 0,
          trucked_water: 0,
          salt_bags: 0,
          coping_supply: 0,
          beam: 0,
          coping_lay: 0,
          excavation_cost: 0
        };
      }

      // Get the pool specifications to get the dig_type_id
      const { data: poolSpec, error: poolError } = await supabase
        .from("pool_specifications")
        .select("dig_type_id")
        .eq("id", poolCosts.pool_id)
        .maybeSingle();

      if (poolError) {
        console.error("Error fetching pool:", poolError);
        throw poolError;
      }

      if (!poolSpec?.dig_type_id) {
        return poolCosts;
      }

      // Get the dig type details
      const { data: digType, error: digError } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .eq("id", poolSpec.dig_type_id)
        .maybeSingle();

      if (digError) {
        console.error("Error fetching dig type:", digError);
        throw digError;
      }

      if (!digType) {
        return poolCosts;
      }

      // Calculate excavation cost
      const excavationCost = 
        (digType.truck_count * digType.truck_hourly_rate * digType.truck_hours) +
        (digType.excavation_hourly_rate * digType.excavation_hours);

      return {
        ...poolCosts,
        excavation_cost: excavationCost
      };
    },
  });

  const costItems = [
    { name: "Excavation Cost", value: costs?.excavation_cost || 0 },
    { name: "Pea Gravel/Backfill", value: costs?.pea_gravel || 0 },
    { name: "Install Fee", value: costs?.install_fee || 0 },
    { name: "Trucked Water", value: costs?.trucked_water || 0 },
    { name: "Salt Bags", value: costs?.salt_bags || 0 },
    { name: "Coping Supply", value: costs?.coping_supply || 0 },
    { name: "Beam", value: costs?.beam || 0 },
    { name: "Coping Lay", value: costs?.coping_lay || 0 },
  ];

  const total = costItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Individual Costs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading costs...</div>
        ) : (
          <div className="space-y-4">
            {costItems.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center"
              >
                <span className="text-sm">{item.name}</span>
                <span className="text-sm font-medium">
                  {formatCurrency(item.value)}
                </span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <span className="font-medium text-sm">Total Individual Costs</span>
              <span className="font-medium text-sm">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
