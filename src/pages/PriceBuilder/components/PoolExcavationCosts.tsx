
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { Skeleton } from "@/components/ui/skeleton";

interface PoolExcavationCostsProps {
  poolId: string;
}

export const PoolExcavationCosts = ({ poolId }: PoolExcavationCostsProps) => {
  const { data: excavationDetails, isLoading } = useQuery({
    queryKey: ["pool-excavation", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          dig_type_id,
          dig_types (
            id,
            name,
            base_price,
            rock_price,
            access_price,
            concrete_price,
            crane_access
          )
        `)
        .eq("pool_id", poolId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Excavation Costs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : excavationDetails?.dig_types ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Dig Type</span>
              <span className="text-sm font-medium">
                {excavationDetails.dig_types.name}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Total Excavation Cost</span>
              <span className="text-sm font-medium text-primary">
                {formatCurrency(calculateGrandTotal(excavationDetails.dig_types))}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground text-center p-8 bg-muted/50 rounded-lg">
            No excavation costs set for this pool
          </div>
        )}
      </CardContent>
    </Card>
  );
};
