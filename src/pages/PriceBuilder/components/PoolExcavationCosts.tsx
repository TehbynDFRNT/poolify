
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
      const { data: match, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          dig_type_id,
          dig_type:dig_types (*)
        `)
        .eq("pool_id", poolId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return match;
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
            <Skeleton className="h-20 w-full" />
          </div>
        ) : excavationDetails?.dig_type ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Dig Type</span>
              <span className="text-sm font-medium">
                {excavationDetails.dig_type.name}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-2 bg-muted/50 rounded-lg p-4">
                <span className="text-sm text-muted-foreground">Excavation</span>
                <span className="text-sm font-medium">
                  {formatCurrency(excavationDetails.dig_type.excavation_hourly_rate * excavationDetails.dig_type.excavation_hours)}
                </span>
              </div>
              
              <div className="flex flex-col space-y-2 bg-muted/50 rounded-lg p-4">
                <span className="text-sm text-muted-foreground">Truck</span>
                <span className="text-sm font-medium">
                  {formatCurrency(excavationDetails.dig_type.truck_hourly_rate * excavationDetails.dig_type.truck_hours * excavationDetails.dig_type.truck_quantity)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Total Excavation Cost</span>
              <span className="text-sm font-medium text-primary">
                {formatCurrency(calculateGrandTotal(excavationDetails.dig_type))}
              </span>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
            No excavation costs set for this pool
          </div>
        )}
      </CardContent>
    </Card>
  );
};
