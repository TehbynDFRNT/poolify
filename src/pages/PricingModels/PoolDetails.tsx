
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
import { CostSummaryCard } from "./components/CostSummaryCard";
import { poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import {
  calculateFiltrationTotal,
  calculatePoolSpecificCosts,
  calculateFixedCostsTotal,
} from "./utils/calculateCosts";

// Define the package mapping here since it's needed for both components
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

  const poolShellPrice = pool.buy_price_inc_gst || 0;
  const filtrationTotal = calculateFiltrationTotal(filtrationPackage);
  const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType);
  const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);

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
        <CostSummaryCard
          poolShellPrice={poolShellPrice}
          filtrationTotal={filtrationTotal}
          totalPoolCosts={totalPoolCosts}
          totalFixedCosts={totalFixedCosts}
        />
      </div>
    </DashboardLayout>
  );
};

export default PoolDetails;
