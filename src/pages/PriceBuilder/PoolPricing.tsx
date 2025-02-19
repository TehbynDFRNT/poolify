
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PoolPricingBreadcrumb } from "./components/PoolPricingBreadcrumb";
import { PoolOutlineCard } from "./components/PoolOutlineCard";
import { PoolSpecificationsCard } from "./components/PoolSpecificationsCard";
import { ShellPriceCard } from "./components/ShellPriceCard";
import { FiltrationPackageCard } from "./components/FiltrationPackageCard";
import { PoolSpecificCostsCard, FixedCostsCard } from "./components/CostCards";

const PoolPricing = () => {
  const { poolId } = useParams();

  const { data: pool, isLoading } = useQuery({
    queryKey: ["pool-pricing", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          default_package:filtration_packages!default_filtration_package_id (
            id,
            name,
            display_order,
            light:filtration_components!light_id (
              id, name, model_number, price
            ),
            pump:filtration_components!pump_id (
              id, name, model_number, price
            ),
            sanitiser:filtration_components!sanitiser_id (
              id, name, model_number, price
            ),
            filter:filtration_components!filter_id (
              id, name, model_number, price
            ),
            handover_kit:handover_kit_packages!handover_kit_id (
              id, 
              name,
              components:handover_kit_package_components (
                id,
                package_id,
                component_id,
                quantity,
                created_at,
                component:filtration_components!component_id (
                  id, name, model_number, price
                )
              )
            )
          )
        `)
        .eq("id", poolId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-48" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <PoolPricingBreadcrumb poolName={pool.name} />
        
        <div className="space-y-6">
          <PoolOutlineCard poolName={pool.name} />
          <PoolSpecificationsCard pool={pool} />
          <ShellPriceCard 
            buyPriceExGst={pool.buy_price_ex_gst}
            buyPriceIncGst={pool.buy_price_inc_gst}
          />
          <FiltrationPackageCard defaultPackage={pool.default_package} />
          <PoolSpecificCostsCard />
          <FixedCostsCard />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;
