
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { FixedCost } from "@/types/fixed-cost";

export const FixedCosts = () => {
  const { data: fixedCosts = [] } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order('display_order');

      if (error) throw error;
      return data as FixedCost[];
    },
  });

  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.price, 0);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Fixed Costs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="space-y-2">
              {fixedCosts.map((cost) => (
                <div key={cost.id} className="flex justify-between">
                  <span>{cost.name}:</span>
                  <span>{formatCurrency(cost.price)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t">
            <div className="flex justify-between">
              <h3 className="font-medium">Total Fixed Costs:</h3>
              <span className="font-medium">
                {formatCurrency(totalFixedCosts)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
