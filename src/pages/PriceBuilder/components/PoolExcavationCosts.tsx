
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
      const { data: match } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          dig_type_id,
          dig_type:dig_types (*)
        `)
        .eq("pool_id", poolId)
        .maybeSingle();

      return match;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Excavation Costs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        ) : excavationDetails?.dig_type ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Dig Type</span>
              <span className="text-sm font-medium">
                {excavationDetails.dig_type.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Total Excavation Cost</span>
              <span className="text-sm font-medium">
                {formatCurrency(calculateGrandTotal(excavationDetails.dig_type))}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            No excavation costs set for this pool
          </div>
        )}
      </CardContent>
    </Card>
  );
};
