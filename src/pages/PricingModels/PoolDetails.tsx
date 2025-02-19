
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Pool } from "@/types/pool";
import type { PackageWithComponents } from "@/types/filtration";
import { PoolBreadcrumb } from "./components/PoolBreadcrumb";
import { PoolHeader } from "./components/PoolHeader";
import { PoolOutline } from "./components/PoolOutline";
import { PoolSpecifications } from "./components/PoolSpecifications";
import { PoolCosts } from "./components/PoolCosts";
import { FixedCosts } from "./components/FixedCosts";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { initialPoolCosts, poolDigTypeMap } from "@/pages/ConstructionCosts/constants";

const PoolDetails = () => {
  const { id } = useParams();

  const { data: pool, isLoading: poolLoading } = useQuery({
    queryKey: ["pool-specification", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          standard_filtration_package: standard_filtration_package_id (
            id,
            name,
            display_order,
            created_at,
            light: light_id ( id, name, model_number, price ),
            pump: pump_id ( id, name, model_number, price ),
            sanitiser: sanitiser_id ( id, name, model_number, price ),
            filter: filter_id ( id, name, model_number, price ),
            handover_kit: handover_kit_id (
              id,
              name,
              components: handover_kit_package_components (
                quantity,
                component: component_id ( id, name, model_number, price )
              )
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as unknown as Pool & { standard_filtration_package: PackageWithComponents | null };
    },
  });

  const { data: digType } = useQuery({
    queryKey: ["excavation-dig-type", pool?.name ? poolDigTypeMap[pool.name] : null],
    queryFn: async () => {
      if (!pool?.name) return null;
      const { data, error } = await supabase
        .from("excavation_dig_types")
        .select("*")
        .eq("name", poolDigTypeMap[pool.name])
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!pool?.name,
  });

  const { data: fixedCosts = [] } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order('display_order');

      if (error) throw error;
      return data;
    },
  });

  if (poolLoading) {
    return <div>Loading...</div>;
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

  // Calculate total fixed costs
  const totalFixedCosts = fixedCosts.reduce((sum, cost) => sum + cost.price, 0);

  // Calculate total pool specific costs
  const poolCosts = initialPoolCosts[pool.name] || {
    truckedWater: 0,
    saltBags: 0,
    copingSupply: 0,
    beam: 0,
    copingLay: 0,
    peaGravel: 0,
    installFee: 0
  };

  const excavationCost = digType ? 
    (digType.truck_count * digType.truck_hourly_rate * digType.truck_hours) +
    (digType.excavation_hourly_rate * digType.excavation_hours) : 0;

  const totalPoolCosts = 
    poolCosts.truckedWater +
    poolCosts.saltBags +
    poolCosts.copingSupply +
    poolCosts.beam +
    poolCosts.copingLay +
    poolCosts.peaGravel +
    poolCosts.installFee +
    excavationCost;

  // Calculate filtration package total for the standard package
  const calculatePackageTotal = (pkg: PackageWithComponents) => {
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

  const filtrationTotal = pool.standard_filtration_package ? 
    calculatePackageTotal(pool.standard_filtration_package) : 0;

  // Calculate pool shell price
  const poolShellPrice = pool.buy_price_inc_gst || 0;

  // Calculate grand total including all components
  const grandTotal = totalFixedCosts + totalPoolCosts + filtrationTotal + poolShellPrice;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <PoolBreadcrumb poolName={pool.name} />
        <PoolHeader name={pool.name} range={pool.range} />
        <PoolOutline />
        <PoolSpecifications pool={pool} />
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Standard Filtration Package</h3>
          {pool.standard_filtration_package ? (
            <div className="space-y-2">
              <p>Option {pool.standard_filtration_package.display_order}</p>
              <p className="text-sm text-muted-foreground">
                To change the standard package, please visit the Filtration Systems page
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No standard package set. Please visit the Filtration Systems page to set one.
            </p>
          )}
        </Card>
        <PoolCosts poolName={pool.name} />
        <FixedCosts />
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Pool Shell Price:</span>
                <span>{formatCurrency(poolShellPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Filtration Package:</span>
                <span>{formatCurrency(filtrationTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Pool Specific Costs:</span>
                <span>{formatCurrency(totalPoolCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fixed Costs:</span>
                <span>{formatCurrency(totalFixedCosts)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-semibold pt-4 border-t">
              <span>True Cost:</span>
              <span>{formatCurrency(grandTotal)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolDetails;
