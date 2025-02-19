import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface PoolFiltrationProps {
  poolId: string;
}

// Import the same mapping used in the filtration packages section
const DEFAULT_PACKAGE_MAPPING: Record<string, number> = {
  "Latina": 1,
  "Sovereign": 1,
  "Empire": 1,
  "Oxford": 1,
  "Sheffield": 1,
  "Avellino": 1,
  "Palazzo": 1,
  "Valentina": 2,
  "Westminster": 2,
  "Kensington": 3,
  "Bedarra": 1,
  "Hayman": 1,
  "Verona": 1,
  "Portofino": 1,
  "Florentina": 1,
  "Bellagio": 1,
  "Bellino": 1,
  "Imperial": 1,
  "Castello": 1,
  "Grandeur": 1,
  "Amalfi": 1,
  "Serenity": 1,
  "Allure": 1,
  "Harmony": 1,
  "Istana": 1,
  "Terazza": 1,
  "Elysian": 1,
  "Infinity 3": 1,
  "Infinity 4": 1,
  "Terrace 3": 1,
};

export const PoolFiltration = ({ poolId }: PoolFiltrationProps) => {
  const { data: poolAndPackage } = useQuery({
    queryKey: ["pool-filtration-option", poolId],
    queryFn: async () => {
      console.log("Fetching pool and filtration package for pool:", poolId);
      // First get the pool to know its name
      const { data: pool } = await supabase
        .from("pool_specifications")
        .select("name")
        .eq('id', poolId)
        .single();

      if (!pool) throw new Error("Pool not found");

      // Get the correct package based on the mapping
      const targetOption = DEFAULT_PACKAGE_MAPPING[pool.name];
      
      const { data: filtrationPackages } = await supabase
        .from("filtration_packages")
        .select("*")
        .eq('display_order', targetOption)
        .single();

      console.log("Fetched filtration data:", filtrationPackages);
      return { pool, package: filtrationPackages };
    },
  });

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
      <CardHeader>
        <CardTitle>Standard Filtration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          {poolAndPackage?.package ? 
            `Option ${poolAndPackage.package.display_order}` : 
            "No filtration package assigned"
          }
        </div>
      </CardContent>
    </Card>
  );
};
