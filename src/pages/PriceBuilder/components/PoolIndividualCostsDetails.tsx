
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface PoolIndividualCostsDetailsProps {
  poolId: string;
}

export const PoolIndividualCostsDetails = ({ poolId }: PoolIndividualCostsDetailsProps) => {
  // First get the pool details to get dig type info
  const { data: poolExcavation } = useQuery({
    queryKey: ["pool-excavation", poolId],
    queryFn: async () => {
      console.log("Fetching pool and excavation data for poolId:", poolId);
      
      const { data: pool } = await supabase
        .from("pool_specifications")
        .select("*")
        .eq("id", poolId)
        .maybeSingle();

      console.log("Pool data:", pool);
      if (!pool) return null;

      const { data: excavationType } = await supabase
        .from("pool_excavation_types")
        .select(`
          *,
          dig_type:excavation_dig_types(*)
        `)
        .eq("name", pool.name)
        .maybeSingle();

      console.log("Excavation type data:", excavationType);
      return excavationType;
    }
  });

  const calculateDigCost = (digType: any) => {
    if (!digType) return 0;
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    const total = truckCost + excavationCost;
    console.log("Calculated dig cost:", { truckCost, excavationCost, total, digType });
    return total;
  };

  const excavationCost = poolExcavation?.dig_type ? calculateDigCost(poolExcavation.dig_type) : 0;
  console.log("Final excavation cost:", excavationCost);

  // Get other pool costs
  const { data: costs, isLoading } = useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      console.log("Fetching costs for pool:", poolId);
      
      const { data: poolCosts, error: costsError } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .maybeSingle();

      if (costsError) {
        console.error("Error fetching costs:", costsError);
        throw costsError;
      }

      console.log("Pool costs data:", poolCosts);

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
    { name: "Excavation Cost", value: excavationCost },
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
