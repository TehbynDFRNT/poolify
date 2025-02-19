
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const PoolPricing = () => {
  const { poolId } = useParams();
  const navigate = useNavigate();

  const { data: pool, isLoading } = useQuery({
    queryKey: ["pool-pricing", poolId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          standard_filtration_package:standard_filtration_package_id (
            id,
            name,
            light:light_id (id, name, price),
            pump:pump_id (id, name, price),
            sanitiser:sanitiser_id (id, name, price),
            filter:filter_id (id, name, price),
            handover_kit:handover_kit_id (
              id,
              name,
              components:handover_kit_package_components (
                quantity,
                component:component_id (
                  id,
                  name,
                  price
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
    return <div>Loading...</div>;
  }

  if (!pool) {
    return <div>Pool not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/price-builder">Price Builder</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{pool.name}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Button 
            variant="outline" 
            onClick={() => navigate('/price-builder')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Price Builder
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{pool.name} - Price Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Base Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Range</dt>
                      <dd className="text-sm">{pool.range}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Dimensions</dt>
                      <dd className="text-sm">
                        {pool.length}m x {pool.width}m
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Depth</dt>
                      <dd className="text-sm">
                        {pool.depth_shallow}m to {pool.depth_deep}m
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Base Costs</CardTitle>
                </CardHeader>
                <CardContent>
                  <dl className="space-y-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Buy Price (ex GST)</dt>
                      <dd className="text-sm">${pool.buy_price_ex_gst?.toFixed(2) || '0.00'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Buy Price (inc GST)</dt>
                      <dd className="text-sm">${pool.buy_price_inc_gst?.toFixed(2) || '0.00'}</dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>
            </div>

            {/* We'll add more pricing calculation sections here */}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;
