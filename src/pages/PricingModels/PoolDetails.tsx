import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Pool } from "@/types/pool";
import { PoolBreadcrumb } from "./components/PoolBreadcrumb";
import { PoolHeader } from "./components/PoolHeader";
import { PoolOutline } from "./components/PoolOutline";
import { PoolSpecifications } from "./components/PoolSpecifications";
import { PoolCosts } from "./components/PoolCosts";
import { FixedCosts } from "./components/FixedCosts";
import { CostSummaryCard } from "./components/CostSummaryCard";
import { poolDigTypeMap } from "@/pages/ConstructionCosts/constants";
import { calculatePoolSpecificCosts, calculateFixedCostsTotal } from "./utils/calculateCosts";
import { calculateFiltrationTotal } from "@/components/pools/utils/filtrationCalculations";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

const PoolDetails = () => {
  const { id } = useParams();

  const { data: pool, isLoading: poolLoading } = useQuery({
    queryKey: ["pool-specification", id],
    queryFn: async () => {
      console.log("Fetching pool with ID:", id);
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          standard_filtration_package:filtration_packages!fk_pool_specs_filtration_package (
            id,
            name,
            display_order,
            light:light_id (id, name, model_number, price),
            pump:pump_id (id, name, model_number, price),
            sanitiser:sanitiser_id (id, name, model_number, price),
            filter:filter_id (id, name, model_number, price),
            handover_kit:handover_kit_id (
              id, 
              name,
              components:handover_kit_package_components(
                id,
                quantity,
                component:component_id(
                  id,
                  name,
                  model_number,
                  price
                )
              )
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching pool:", error);
        throw error;
      }

      console.log("Fetched pool data:", data);
      return data as unknown as Pool;
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

  const poolShellPrice = pool.buy_price_inc_gst || 0;
  const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType);
  const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);
  const filtrationTotal = calculateFiltrationTotal(pool.standard_filtration_package || null);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <PoolBreadcrumb poolName={pool.name} />
        <PoolHeader name={pool.name} range={pool.range} />
        <PoolOutline />
        <PoolSpecifications pool={pool} />
        
        {/* Filtration Package Card */}
        <Card className="bg-gradient-to-br from-white to-gray-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-gray-700">Pool Filtration Package</CardTitle>
            {pool.standard_filtration_package && (
              <div className="text-lg font-semibold text-gray-700">
                {formatCurrency(filtrationTotal)}
              </div>
            )}
          </CardHeader>
          <CardContent>
            {pool.standard_filtration_package ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Option {pool.standard_filtration_package.display_order}</span>
                </div>
                <div className="grid grid-cols-5 gap-6">
                  <div>
                    <div className="font-medium mb-1">Light</div>
                    <div className="text-sm text-gray-600">
                      {pool.standard_filtration_package.light?.model_number || 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Pool Pump</div>
                    <div className="text-sm text-gray-600">
                      {pool.standard_filtration_package.pump?.model_number || 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Sanitiser</div>
                    <div className="text-sm text-gray-600">
                      {pool.standard_filtration_package.sanitiser?.model_number || 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Filter</div>
                    <div className="text-sm text-gray-600">
                      {pool.standard_filtration_package.filter?.model_number || 'None'}
                    </div>
                  </div>
                  <div>
                    <div className="font-medium mb-1">Handover Kit</div>
                    <div className="text-sm text-gray-600">
                      {pool.standard_filtration_package.handover_kit?.name || 'None'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
                <div className="text-center space-y-3">
                  <div className="text-3xl text-gray-400">🔄</div>
                  <p className="text-gray-500">No filtration package selected</p>
                  <p className="text-sm text-gray-400">
                    Light • Pool Pump • Sanitiser • Filter • Handover Kit
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

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
