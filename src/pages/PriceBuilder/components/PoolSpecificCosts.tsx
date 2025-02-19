
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

export const PoolSpecificCosts = () => {
  const { poolId } = useParams();

  const { data: poolCosts, isLoading } = useQuery({
    queryKey: ["pool-costs", poolId],
    queryFn: async () => {
      console.log("Fetching pool costs for poolId:", poolId);
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*")
        .eq("pool_id", poolId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching pool costs:", error);
        throw error;
      }
      
      console.log("Pool costs data:", data);
      // If no data exists, return default values
      return data || {
        pea_gravel: 0,
        install_fee: 0,
        trucked_water: 0,
        salt_bags: 0,
        misc: 2700, // Default value from schema
        coping_supply: 0,
        beam: 0,
        coping_lay: 0,
      };
    },
  });

  const { data: digType } = useQuery({
    queryKey: ["pool-dig-type", poolId],
    queryFn: async () => {
      console.log("Fetching dig type for poolId:", poolId);
      const { data: pool } = await supabase
        .from("pool_specifications")
        .select("dig_type_id")
        .eq("id", poolId)
        .single();

      if (!pool?.dig_type_id) return null;

      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .eq("id", pool.dig_type_id)
        .single();

      if (error) {
        console.error("Error fetching dig type:", error);
        throw error;
      }
      
      console.log("Dig type data:", data);
      return data;
    },
    enabled: !!poolId,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pool Specific Costs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate excavation cost if dig type exists
  const excavationCost = digType ? 
    (digType.truck_count * digType.truck_hourly_rate * digType.truck_hours) +
    (digType.excavation_hourly_rate * digType.excavation_hours) : 
    0;

  // Calculate total including excavation
  const total = poolCosts ? 
    Object.values({
      pea_gravel: poolCosts.pea_gravel || 0,
      install_fee: poolCosts.install_fee || 0,
      trucked_water: poolCosts.trucked_water || 0,
      salt_bags: poolCosts.salt_bags || 0,
      misc: poolCosts.misc || 0,
      coping_supply: poolCosts.coping_supply || 0,
      beam: poolCosts.beam || 0,
      coping_lay: poolCosts.coping_lay || 0,
    }).reduce((sum, value) => sum + value, 0) + excavationCost :
    0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Specific Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Pea Gravel/Backfill</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.pea_gravel || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Install Fee</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.install_fee || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Trucked Water</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.trucked_water || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Salt Bags</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.salt_bags || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Misc</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.misc || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Coping Supply</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.coping_supply || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Beam</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.beam || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Coping Lay</dt>
              <dd className="text-lg">{formatCurrency(poolCosts?.coping_lay || 0)}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Dig Type</dt>
              <dd className="text-lg">{digType ? digType.name : '-'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Excavation</dt>
              <dd className="text-lg">{formatCurrency(excavationCost)}</dd>
            </div>
          </div>

          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <div className="text-lg font-medium">Total Pool Specific Costs</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(total)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
