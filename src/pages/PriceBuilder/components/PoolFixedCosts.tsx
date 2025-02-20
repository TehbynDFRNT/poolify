
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
      console.log("Fetching fixed costs...");
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");

      if (error) {
        console.error("Error fetching fixed costs:", error);
        throw error;
      }
      
      console.log("Fixed costs data:", data);
      return data as FixedCost[];
    },
  });

  if (isLoading) {
    console.log("Fixed costs loading state:", isLoading);
    return (
      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Fixed Costs</CardTitle>
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
  console.log("Fixed costs total:", total);

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Fixed Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fixedCosts?.map((cost) => (
              <div 
                key={cost.id} 
                className="bg-muted/50 rounded-lg p-4 space-y-2"
              >
                <div className="text-sm text-muted-foreground">
                  {cost.name}
                </div>
                <div className="text-sm font-medium">
                  {formatCurrency(cost.price)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center p-4 bg-muted/50 rounded-lg mt-6">
            <span className="text-sm text-muted-foreground">Total Fixed Costs</span>
            <span className="text-sm font-medium text-primary">
              {formatCurrency(total)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
