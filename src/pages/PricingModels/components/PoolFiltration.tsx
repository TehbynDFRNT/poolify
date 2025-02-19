
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PoolFiltrationProps {
  poolId: string;
}

export const PoolFiltration = ({ poolId }: PoolFiltrationProps) => {
  const { data: filtrationPackage } = useQuery({
    queryKey: ["pool-filtration-option", poolId],
    queryFn: async () => {
      console.log("Fetching filtration package for pool:", poolId);
      const { data: filtrationPackages } = await supabase
        .from("filtration_packages")
        .select("*")
        .eq('display_order', 1)
        .single();

      console.log("Fetched filtration data:", filtrationPackages);
      return filtrationPackages;
    },
  });

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
      <CardHeader>
        <CardTitle>Standard Filtration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {filtrationPackage ? 
            `Option ${filtrationPackage.display_order}` : 
            "No filtration package assigned"
          }
        </div>
      </CardContent>
    </Card>
  );
};
