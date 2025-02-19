
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
      console.log("Fetching fixed costs");
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fixedCosts?.map((cost) => (
              <div key={cost.id}>
                <dt className="text-sm font-medium text-gray-500">{cost.name}</dt>
                <dd className="text-lg">{formatCurrency(cost.price)}</dd>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-6 flex justify-between items-center">
            <div className="text-lg font-medium">Total Fixed Costs</div>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(total)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
