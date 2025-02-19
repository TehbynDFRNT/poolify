import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign } from "lucide-react";
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
import { formatCurrency } from "@/utils/format";
import { Skeleton } from "@/components/ui/skeleton";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";

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
            <CardTitle>Pool Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Range</dt>
                  <dd className="text-lg">{pool.range}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="text-lg">{pool.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Length</dt>
                  <dd className="text-lg">{pool.length}m</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Width</dt>
                  <dd className="text-lg">{pool.width}m</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Shallow Depth</dt>
                  <dd className="text-lg">{pool.depth_shallow}m</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Deep Depth</dt>
                  <dd className="text-lg">{pool.depth_deep}m</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Waterline</dt>
                  <dd className="text-lg">{pool.waterline_l_m ? `${pool.waterline_l_m}L/m` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Volume</dt>
                  <dd className="text-lg">{pool.volume_liters ? `${pool.volume_liters}L` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Salt Bags</dt>
                  <dd className="text-lg">{pool.salt_volume_bags || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="text-lg">{pool.weight_kg ? `${pool.weight_kg}kg` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Initial Minerals</dt>
                  <dd className="text-lg">{pool.minerals_kg_initial ? `${pool.minerals_kg_initial}kg` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Topup Minerals</dt>
                  <dd className="text-lg">{pool.minerals_kg_topup ? `${pool.minerals_kg_topup}kg` : '-'}</dd>
                </div>
              </dl>
              
              <div className="border-t pt-4 mt-6 flex justify-between items-center">
                <div className="space-y-1">
                  <dt className="text-sm font-medium text-gray-500">Price (ex GST)</dt>
                  <dd className="text-lg">
                    {pool.buy_price_ex_gst ? formatCurrency(pool.buy_price_ex_gst) : '-'}
                  </dd>
                </div>
                <div className="text-right space-y-1">
                  <dt className="text-sm font-medium text-gray-500">Price (inc GST)</dt>
                  <dd className="text-2xl font-bold text-primary">
                    {pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : '-'}
                  </dd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Filtration Package</CardTitle>
          </CardHeader>
          <CardContent>
            {!filtrationPackage ? (
              <div className="bg-muted/50 rounded-lg p-8 text-center text-muted-foreground">
                No filtration package selected for this pool
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Light */}
                  {filtrationPackage.light && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Light</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-sm">{filtrationPackage.light.model_number}</div>
                        <div className="text-sm text-muted-foreground">{filtrationPackage.light.name}</div>
                        <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.light.price)}</div>
                      </div>
                    </div>
                  )}

                  {/* Pump */}
                  {filtrationPackage.pump && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Pool Pump</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-sm">{filtrationPackage.pump.model_number}</div>
                        <div className="text-sm text-muted-foreground">{filtrationPackage.pump.name}</div>
                        <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.pump.price)}</div>
                      </div>
                    </div>
                  )}

                  {/* Sanitiser */}
                  {filtrationPackage.sanitiser && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Sanitiser</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-sm">{filtrationPackage.sanitiser.model_number}</div>
                        <div className="text-sm text-muted-foreground">{filtrationPackage.sanitiser.name}</div>
                        <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.sanitiser.price)}</div>
                      </div>
                    </div>
                  )}

                  {/* Filter */}
                  {filtrationPackage.filter && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Filter</h4>
                      <div className="bg-muted/30 rounded-lg p-4">
                        <div className="text-sm">{filtrationPackage.filter.model_number}</div>
                        <div className="text-sm text-muted-foreground">{filtrationPackage.filter.name}</div>
                        <div className="mt-2 font-medium">{formatCurrency(filtrationPackage.filter.price)}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Handover Kit */}
                {filtrationPackage.handover_kit && (
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Handover Kit: {filtrationPackage.handover_kit.name}</h4>
                    <div className="space-y-2">
                      {filtrationPackage.handover_kit.components.map((component) => (
                        <div key={component.id} className="bg-muted/30 rounded-lg p-4 flex justify-between items-center">
                          <div>
                            <div className="text-sm">{component.component.model_number}</div>
                            <div className="text-sm text-muted-foreground">{component.component.name}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">x{component.quantity}</div>
                            <div className="font-medium">
                              {formatCurrency(component.component.price * component.quantity)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total */}
                <div className="pt-6 border-t flex justify-between items-center">
                  <div className="text-lg font-medium">Total Package Price</div>
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(calculatePackagePrice(filtrationPackage))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pool Specific Costs Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Pool Specific Costs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 rounded-lg p-8 text-center text-muted-foreground">
              Pool specific costs information will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;
