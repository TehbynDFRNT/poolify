
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
import {
  calculatePoolSpecificCosts,
  calculateFixedCostsTotal,
} from "./utils/calculateCosts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

  if (poolLoading) {
    return <div>Loading...</div>;
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

  const poolShellPrice = pool.buy_price_inc_gst || 0;
  const totalPoolCosts = calculatePoolSpecificCosts(pool.name, digType);
  const totalFixedCosts = calculateFixedCostsTotal(fixedCosts);

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <PoolBreadcrumb poolName={pool.name} />
        <PoolHeader name={pool.name} range={pool.range} />
        <PoolOutline />
        <PoolSpecifications pool={pool} />
        
        {/* Filtration Placeholder Card */}
        <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-dashed border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-700">Pool Filtration Package</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg">
              <div className="text-center space-y-3">
                <div className="text-3xl text-gray-400">🔄</div>
                <p className="text-gray-500">Pool filtration options coming soon</p>
                <p className="text-sm text-gray-400">
                  Light • Pool Pump • Sanitiser • Filter • Handover Kit
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <PoolCosts poolName={pool.name} />
        <FixedCosts />
        <CostSummaryCard
          poolShellPrice={poolShellPrice}
          filtrationTotal={0}
          totalPoolCosts={totalPoolCosts}
          totalFixedCosts={totalFixedCosts}
        />
      </div>
    </DashboardLayout>
  );
};

export default PoolDetails;
