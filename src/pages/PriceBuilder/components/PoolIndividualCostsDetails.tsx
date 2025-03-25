
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";

interface PoolIndividualCostsDetailsProps {
  poolId: string;
}

export const PoolIndividualCostsDetails = ({ poolId }: PoolIndividualCostsDetailsProps) => {
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
          misc: 0
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
    { name: "Misc", value: costs?.misc || 0 },
  ];

  const total = costItems.reduce((sum, item) => sum + item.value, 0);
  
  // Filter out zero value cost items for display
  const nonZeroCostItems = costItems.filter(item => item.value > 0);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Pool Individual Costs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : nonZeroCostItems.length > 0 ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nonZeroCostItems.map((item, index) => (
                <div
                  key={index}
                  className="bg-muted/50 rounded-lg p-4 space-y-2"
                >
                  <div className="text-sm text-muted-foreground">
                    {item.name}
                  </div>
                  <div className="text-sm font-medium">
                    {formatCurrency(item.value)}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg mt-6">
              <span className="text-sm text-muted-foreground">Total Individual Costs</span>
              <span className="text-sm font-medium text-primary">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No individual costs set for this pool
          </div>
        )}
      </CardContent>
    </Card>
  );
};
