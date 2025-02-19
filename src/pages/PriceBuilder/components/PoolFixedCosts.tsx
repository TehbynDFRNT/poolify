
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import type { FixedCost } from "@/types/fixed-cost";

export const PoolFixedCosts = () => {
  const { data: fixedCosts, isLoading } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as FixedCost[];
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Fixed Costs</CardTitle>
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

  const total = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fixed Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fixedCosts?.map((cost) => (
              <div 
                key={cost.id} 
                className="bg-muted/50 rounded-lg p-4 space-y-2"
              >
                <div className="text-sm font-medium text-muted-foreground">
                  {cost.name}
                </div>
                <div className="text-2xl font-bold">
                  {formatCurrency(cost.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="flex justify-between items-center">
              <div className="text-lg font-medium">Total Fixed Costs</div>
              <div className="text-2xl font-bold text-primary">
                {formatCurrency(total)}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
