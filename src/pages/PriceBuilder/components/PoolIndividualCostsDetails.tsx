
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";

interface PoolIndividualCostsDetailsProps {
  poolRange: string;
}

export const PoolIndividualCostsDetails = ({ poolRange }: PoolIndividualCostsDetailsProps) => {
  const { data: individualCosts, isLoading } = useQuery({
    queryKey: ["pool-individual-costs", poolRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_individual_costs")
        .select("*")
        .eq("range", poolRange)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const total = individualCosts?.reduce((sum, cost) => sum + (cost.cost_value || 0), 0) || 0;

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Pool Individual Costs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading costs...</div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {individualCosts?.map((cost) => (
                <div
                  key={cost.id}
                  className="flex justify-between items-center p-4 rounded-lg bg-secondary"
                >
                  <span className="text-sm font-medium">{cost.name}</span>
                  <span className="text-sm font-medium">
                    {formatCurrency(cost.cost_value)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center p-4 rounded-lg bg-primary/10">
              <span className="font-semibold">Total Individual Costs</span>
              <span className="font-semibold">{formatCurrency(total)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
