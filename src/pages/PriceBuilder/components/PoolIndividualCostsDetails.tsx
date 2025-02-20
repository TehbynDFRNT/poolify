
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface PoolIndividualCostsDetailsProps {
  poolId: string;
}

export const PoolIndividualCostsDetails = ({ poolId }: PoolIndividualCostsDetailsProps) => {
  // Get excavation details
  const { data: excavationDetails, isLoading: isLoadingExcavation } = useQuery({
    queryKey: ["pool-excavation", poolId],
    queryFn: async () => {
      // First get the pool details to get its name and range
      const { data: pool } = await supabase
        .from("pool_specifications")
        .select("name, range")
        .eq("id", poolId)
        .maybeSingle();

      if (!pool) return null;

      // Get the pool excavation type with its dig type details
      const { data: excavationType } = await supabase
        .from("pool_excavation_types")
        .select(`
          dig_type_id,
          excavation_dig_types!pool_excavation_types_dig_type_id_fkey(
            id,
            name,
            truck_count,
            truck_hourly_rate,
            truck_hours,
            excavation_hourly_rate,
            excavation_hours
          )
        `)
        .eq("name", pool.name)
        .eq("range", pool.range)
        .maybeSingle();

      console.log('Pool:', pool);
      console.log('Excavation type:', excavationType);
      
      return excavationType;
    }
  });

  // Calculate dig cost
  const calculateDigCost = (digType: any) => {
    if (!digType) return 0;
    const truckCost = digType.truck_count * digType.truck_hourly_rate * digType.truck_hours;
    const excavationCost = digType.excavation_hourly_rate * digType.excavation_hours;
    return truckCost + excavationCost;
  };

  // Get pool costs
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
          coping_lay: 0
        };
      }

      return poolCosts;
    },
  });

  const costItems = [
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Excavation</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingExcavation ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          ) : excavationDetails?.excavation_dig_types ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Dig Type</span>
                <span className="text-sm font-medium">{excavationDetails.excavation_dig_types.name}</span>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-medium text-sm">Total Excavation Cost</span>
                <span className="font-medium text-sm">
                  {formatCurrency(calculateDigCost(excavationDetails.excavation_dig_types))}
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Dig Type</span>
                <span className="text-sm font-medium text-gray-500">Not assigned</span>
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-medium text-sm">Total Excavation Cost</span>
                <span className="font-medium text-sm text-gray-500">Not available</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pool Individual Costs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 7 }).map((_, index) => (
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
    </div>
  );
};
