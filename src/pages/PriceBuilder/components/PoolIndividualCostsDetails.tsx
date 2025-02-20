
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface PoolIndividualCostsDetailsProps {
  poolId: string;
}

export const PoolIndividualCostsDetails = ({ poolId }: PoolIndividualCostsDetailsProps) => {
  // Get pool details first
  const { data: poolDetails, isLoading: isPoolLoading } = useQuery({
    queryKey: ["pool-details", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("name, range")
        .eq("id", poolId)
        .maybeSingle();

      if (error) throw error;
      console.log("Pool details:", data);
      return data;
    },
  });

  // Get dig type details using pool name and range
  const { data: digData, isLoading: isDigLoading } = useQuery({
    queryKey: ["pool-dig-type", poolDetails?.name, poolDetails?.range],
    queryFn: async () => {
      if (!poolDetails?.name || !poolDetails?.range) return null;

      console.log("Looking up dig type for:", {
        name: poolDetails.name,
        range: poolDetails.range
      });

      const { data, error } = await supabase
        .from("pool_dig_types")
        .select(`
          *,
          dig_type:dig_types(*)
        `)
        .eq("pool_name", poolDetails.name)
        .eq("pool_range", poolDetails.range)
        .maybeSingle();

      if (error) throw error;
      console.log("Dig type data:", data);
      return data;
    },
    enabled: !!poolDetails?.name && !!poolDetails?.range,
  });

  // Get pool costs
  const { data: costs, isLoading: isCostsLoading } = useQuery({
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

  const isLoading = isCostsLoading || isDigLoading || isPoolLoading;

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
          <CardTitle>Dig Costs</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Dig Type</span>
                <span className="text-sm font-medium">
                  {digData?.dig_type?.name || 'Not assigned'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Dig Cost</span>
                <span className="text-sm font-medium">
                  {formatCurrency(digData?.dig_type?.cost || 0)}
                </span>
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
