
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import type { PackageWithComponents } from "@/types/filtration";
import { PoolDetails } from "./components/PoolDetails";
import { FiltrationPackageDetails } from "./components/FiltrationPackageDetails";
import { PoolFixedCosts } from "./components/PoolFixedCosts";
import { PoolIndividualCostsDetails } from "./components/PoolIndividualCostsDetails";
import { PoolExcavationCosts } from "./components/PoolExcavationCosts";
import { PricingSummary } from "./components/PricingSummary";
import { PoolLineDiagram } from "./components/PoolLineDiagram";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const PoolPricing = () => {
  const { poolId } = useParams();
  const navigate = useNavigate();

  const { data: pool, isLoading: isPoolLoading } = useQuery({
    queryKey: ["pool-pricing", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select("*")
        .eq("id", poolId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const { data: filtrationPackage, isLoading: isPackageLoading } = useQuery({
    queryKey: ["filtration-package", pool?.default_filtration_package_id],
    queryFn: async () => {
      if (!pool?.default_filtration_package_id) return null;

      const { data, error } = await supabase
        .from("filtration_packages")
        .select(`
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
              quantity,
              package_id,
              component_id,
              created_at,
              component:filtration_components!component_id (
                id,
                name,
                model_number,
                price
              )
            )
          )
        `)
        .eq('id', pool.default_filtration_package_id)
        .single();

      if (error) throw error;
      return data as PackageWithComponents;
    },
    enabled: !!pool?.default_filtration_package_id,
  });

  const isLoading = isPoolLoading || isPackageLoading;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 space-y-8">
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-32" />
          </div>
          <Card className="bg-white shadow-sm">
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
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-between mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link to="/price-builder" className="hover:text-foreground transition-colors">Price Builder</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem className="text-muted-foreground">{pool?.name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button 
            variant="outline" 
            onClick={() => navigate('/price-builder')}
            className="hover:bg-muted"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Price Builder
          </Button>
        </div>

        <div className="space-y-6">
          <PoolLineDiagram pool={pool} />
          <PoolDetails pool={pool} />
          <FiltrationPackageDetails filtrationPackage={filtrationPackage} />
          <PoolFixedCosts />
          <PoolIndividualCostsDetails poolId={pool.id} />
          <PoolExcavationCosts poolId={pool.id} />
          <PricingSummary 
            poolId={pool.id}
            poolBasePrice={pool.buy_price_inc_gst || 0}
            filtrationPackage={filtrationPackage}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;
