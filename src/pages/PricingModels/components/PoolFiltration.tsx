
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PoolFiltrationProps {
  poolId: string;
}

export const PoolFiltration = ({ poolId }: PoolFiltrationProps) => {
  const { data: filtrationOption } = useQuery({
    queryKey: ["pool-filtration-option", poolId],
    queryFn: async () => {
      console.log("Fetching filtration package for pool:", poolId);
      // First, get the pool's name
      const { data: pool } = await supabase
        .from("pool_specifications")
        .select("name")
        .eq('id', poolId)
        .single();

      if (!pool) throw new Error("Pool not found");

      // Then, get the filtration package based on the pool's name
      const { data: filtrationPackages } = await supabase
        .from("filtration_packages")
        .select("*")
        .eq('display_order', 1); // Empire uses Option 1

      if (!filtrationPackages || filtrationPackages.length === 0) {
        throw new Error("Filtration package not found");
      }

      console.log("Fetched filtration data:", filtrationPackages[0]);
      return filtrationPackages[0];
    },
  });

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
      <CardHeader>
        <CardTitle>Standard Filtration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {filtrationOption ? 
            `Option ${filtrationOption.display_order}` : 
            "No filtration package assigned"
          }
        </div>
      </CardContent>
    </Card>
  );
};
