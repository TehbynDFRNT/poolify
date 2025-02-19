
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
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          name,
          standard_filtration_package:filtration_packages (
            display_order
          )
        `)
        .eq('id', poolId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching filtration option:", error);
        throw error;
      }

      console.log("Fetched filtration data:", data);
      return data;
    },
  });

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
      <CardHeader>
        <CardTitle>Standard Filtration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {filtrationOption?.standard_filtration_package ? 
            `Option ${filtrationOption.standard_filtration_package.display_order}` :
            "No filtration package assigned"
          }
        </div>
      </CardContent>
    </Card>
  );
};
