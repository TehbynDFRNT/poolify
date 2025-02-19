
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Pool } from "@/types/pool";
import { PoolBreadcrumb } from "./components/PoolBreadcrumb";
import { PoolHeader } from "./components/PoolHeader";
import { PoolOutline } from "./components/PoolOutline";
import { PoolSpecifications } from "./components/PoolSpecifications";
import { PoolFiltration } from "./components/PoolFiltration";
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
      console.log("Fetching pool with ID:", id);
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching pool:", error);
        throw error;
      }
      console.log("Fetched pool data:", data);
      return data as Pool;
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

  const { data: filtrationPackage } = useQuery({
    queryKey: ["pool-filtration-package", pool?.name],
    queryFn: async () => {
      if (!pool?.name) return null;
      
      const targetOption = DEFAULT_PACKAGE_MAPPING[pool.name];
      
      const { data, error } = await supabase
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

      if (error) throw error;
      return data;
    },
    enabled: !!pool?.name,
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

  // Calculate pool shell price
  const poolShellPrice = pool.buy_price_inc_gst || 0;

  // Calculate filtration package total
  const calculateFiltrationTotal = () => {
    if (!filtrationPackage) return 0;
    
    const handoverKitTotal = filtrationPackage.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return (
      (filtrationPackage.light?.price || 0) +
      (filtrationPackage.pump?.price || 0) +
      (filtrationPackage.sanitiser?.price || 0) +
      (filtrationPackage.filter?.price || 0) +
      handoverKitTotal
    );
  };

  const filtrationTotal = calculateFiltrationTotal();

  // Calculate grand total
  const grandTotal = totalFixedCosts + totalPoolCosts + poolShellPrice + filtrationTotal;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <PoolBreadcrumb poolName={pool.name} />
        <PoolHeader name={pool.name} range={pool.range} />
        <PoolOutline />
        <PoolSpecifications pool={pool} />
        <PoolFiltration poolId={id!} />
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
                <span>Pool Specific Costs:</span>
                <span>{formatCurrency(totalPoolCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Fixed Costs:</span>
                <span>{formatCurrency(totalFixedCosts)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Filtration Package:</span>
                <span>{formatCurrency(filtrationTotal)}</span>
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
