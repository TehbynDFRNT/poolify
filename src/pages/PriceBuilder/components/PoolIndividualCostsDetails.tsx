
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface PoolIndividualCostsDetailsProps {
  poolId: string;
}

export const PoolIndividualCostsDetails = ({ poolId }: PoolIndividualCostsDetailsProps) => {
  // Get excavation cost
  const { data: excavationCost } = useQuery({
    queryKey: ["pool-excavation-cost", poolId],
    queryFn: async () => {
      try {
        // Get pool name first
        const poolResponse = await supabase
          .from("pool_specifications")
          .select("name")
          .eq("id", poolId)
          .maybeSingle();

        const poolName = poolResponse.data?.name;
        if (!poolName) return 0;

        // Get excavation type
        const excavationResponse = await supabase
          .from("pool_excavation_types")
          .select("dig_type_id")
          .eq("name", poolName)
          .maybeSingle();

        const digTypeId = excavationResponse.data?.dig_type_id;
        if (!digTypeId) return 0;

        // Get dig type details
        const digTypeResponse = await supabase
          .from("excavation_dig_types")
          .select("*")
          .eq("id", digTypeId)
          .maybeSingle();

        const digType = digTypeResponse.data;
        if (!digType) return 0;

        const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
        const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
        
        return truckCost + excavationCost;
      } catch (error) {
        console.error("Error calculating excavation cost:", error);
        return 0;
      }
    }
  });

  // Get other pool costs
  const { data: costs, isLoading } = useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      const { data: poolCosts } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .maybeSingle();

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

      return poolCosts;
    },
  });

  const costItems = [
    { name: "Excavation Cost", value: excavationCost || 0 },
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
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
            <div className="mt-4 pt-4 border-t flex justify-between items-center">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
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
