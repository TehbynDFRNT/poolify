
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";

interface PoolFiltrationProps {
  poolId: string;
}

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
        .select(`
          *,
          light:filtration_components!light_id(id, name, model_number, price),
          pump:filtration_components!pump_id(id, name, model_number, price),
          sanitiser:filtration_components!sanitiser_id(id, name, model_number, price),
          filter:filtration_components!filter_id(id, name, model_number, price),
          handover_kit:handover_kit_packages!handover_kit_id(
            id, 
            name,
            components:handover_kit_package_components(
              id,
              quantity,
              component:filtration_components(
                id,
                name,
                model_number,
                price
              )
            )
          )
        `)
        .eq('display_order', targetOption)
        .single();

      console.log("Fetched filtration data:", filtrationPackages);
      return { pool, package: filtrationPackages };
    },
  });

  const calculatePackageTotal = () => {
    if (!poolAndPackage?.package) return 0;
    
    const pkg = poolAndPackage.package;
    const handoverKitTotal = pkg.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (pkg.filter?.price || 0) +
      handoverKitTotal
    );
  };

  return (
    <Card className="bg-gradient-to-r from-slate-50 to-slate-100">
      <CardHeader>
        <CardTitle>Standard Filtration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {poolAndPackage?.package ? (
          <>
            <div className="text-sm text-muted-foreground">
              Option {poolAndPackage.package.display_order}
            </div>
            <div className="space-y-2">
              {poolAndPackage.package.light && (
                <div className="flex justify-between text-sm">
                  <span>Light:</span>
                  <span className="text-right">
                    <div>{poolAndPackage.package.light.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(poolAndPackage.package.light.price)}</div>
                  </span>
                </div>
              )}
              {poolAndPackage.package.pump && (
                <div className="flex justify-between text-sm">
                  <span>Pool Pump:</span>
                  <span className="text-right">
                    <div>{poolAndPackage.package.pump.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(poolAndPackage.package.pump.price)}</div>
                  </span>
                </div>
              )}
              {poolAndPackage.package.sanitiser && (
                <div className="flex justify-between text-sm">
                  <span>Sanitiser:</span>
                  <span className="text-right">
                    <div>{poolAndPackage.package.sanitiser.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(poolAndPackage.package.sanitiser.price)}</div>
                  </span>
                </div>
              )}
              {poolAndPackage.package.filter && (
                <div className="flex justify-between text-sm">
                  <span>Filter:</span>
                  <span className="text-right">
                    <div>{poolAndPackage.package.filter.model_number}</div>
                    <div className="text-muted-foreground">{formatCurrency(poolAndPackage.package.filter.price)}</div>
                  </span>
                </div>
              )}
              {poolAndPackage.package.handover_kit && (
                <div className="flex justify-between text-sm">
                  <span>Handover Kit:</span>
                  <span className="text-right">
                    <div>{poolAndPackage.package.handover_kit.name}</div>
                    <div className="text-muted-foreground">
                      {formatCurrency(
                        poolAndPackage.package.handover_kit.components.reduce(
                          (total, comp) => total + ((comp.component?.price || 0) * comp.quantity),
                          0
                        )
                      )}
                    </div>
                  </span>
                </div>
              )}
            </div>
            <div className="flex justify-between pt-4 border-t text-base font-semibold">
              <span>Package Total:</span>
              <span>{formatCurrency(calculatePackageTotal())}</span>
            </div>
          </>
        ) : (
          <div className="text-sm text-muted-foreground">
            No filtration package assigned
          </div>
        )}
      </CardContent>
    </Card>
  );
};
