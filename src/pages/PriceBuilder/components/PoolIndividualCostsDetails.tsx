
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";

interface PoolIndividualCostsDetailsProps {
  poolRange: string;
}

export const PoolIndividualCostsDetails = ({ poolRange }: PoolIndividualCostsDetailsProps) => {
  console.log("Pool range:", poolRange); // Debug log

  const { data: individualCosts, isLoading } = useQuery({
    queryKey: ["pool-individual-costs", poolRange],
    queryFn: async () => {
      console.log("Fetching costs for range:", poolRange); // Debug log
      const { data, error } = await supabase
        .from("pool_individual_costs")
        .select("*")
        .eq("range", poolRange)
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching costs:", error); // Debug log
        throw error;
      }
      console.log("Fetched costs:", data); // Debug log
      return data;
    },
  });

  const total = individualCosts?.reduce((sum, cost) => sum + (cost.cost_value || 0), 0) || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Individual Costs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>Loading costs...</div>
        ) : (
          <div className="space-y-4">
            {individualCosts?.length === 0 ? (
              <div className="text-muted-foreground text-sm">No individual costs found for this pool range.</div>
            ) : (
              <>
                {individualCosts?.map((cost) => (
                  <div
                    key={cost.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">{cost.name}</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(cost.cost_value)}
                    </span>
                  </div>
                ))}
                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                  <span className="font-medium text-sm">Total Individual Costs</span>
                  <span className="font-medium text-sm">{formatCurrency(total)}</span>
                </div>
              </>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
