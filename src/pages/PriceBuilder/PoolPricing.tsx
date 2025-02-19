
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Package, List, Database, ImagePlus } from "lucide-react";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calculatePackagePrice } from "@/utils/package-calculations";

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

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pool Outline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full max-w-md mx-auto">
                <div className="relative w-full aspect-[4/3] border-2 border-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src="/lovable-uploads/067e2299-40f3-4c0e-bf8a-3fb279d3c79b.png"
                    alt={`${pool.name} outline`}
                    className="w-full h-full object-contain bg-white"
                  />
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <ImagePlus className="h-4 w-4 mr-2" />
                    Change Pool Image
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pool Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-4 gap-4">
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
                  <dt className="text-sm font-medium text-gray-500">Weight</dt>
                  <dd className="text-lg">{pool.weight_kg ? `${pool.weight_kg}kg` : '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Salt Bags</dt>
                  <dd className="text-lg">{pool.salt_volume_bags || '-'}</dd>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Shell Price
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price (ex GST)</dt>
                  <dd className="text-lg font-medium">
                    {pool.buy_price_ex_gst ? formatCurrency(pool.buy_price_ex_gst) : '-'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Price (inc GST)</dt>
                  <dd className="text-2xl font-semibold text-primary">
                    {pool.buy_price_inc_gst ? formatCurrency(pool.buy_price_inc_gst) : '-'}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Default Filtration Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pool.default_package ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Option {pool.default_package.display_order}
                  </h3>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency(calculatePackagePrice(pool.default_package))}
                  </p>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead>Model</TableHead>
                      <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pool.default_package.light && (
                      <TableRow>
                        <TableCell>Light</TableCell>
                        <TableCell>{pool.default_package.light.model_number}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(pool.default_package.light.price)}
                        </TableCell>
                      </TableRow>
                    )}
                    {pool.default_package.pump && (
                      <TableRow>
                        <TableCell>Pool Pump</TableCell>
                        <TableCell>{pool.default_package.pump.model_number}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(pool.default_package.pump.price)}
                        </TableCell>
                      </TableRow>
                    )}
                    {pool.default_package.sanitiser && (
                      <TableRow>
                        <TableCell>Sanitiser</TableCell>
                        <TableCell>{pool.default_package.sanitiser.model_number}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(pool.default_package.sanitiser.price)}
                        </TableCell>
                      </TableRow>
                    )}
                    {pool.default_package.filter && (
                      <TableRow>
                        <TableCell>Filter</TableCell>
                        <TableCell>{pool.default_package.filter.model_number}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(pool.default_package.filter.price)}
                        </TableCell>
                      </TableRow>
                    )}
                    {pool.default_package.handover_kit?.components.map((comp) => (
                      <TableRow key={comp.component.id}>
                        <TableCell>
                          {comp.component.name}
                          {comp.quantity > 1 && ` (x${comp.quantity})`}
                        </TableCell>
                        <TableCell>{comp.component.model_number}</TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(comp.component.price * comp.quantity)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No default filtration package assigned</p>
              </div>
            )}
          </CardContent>
        </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <List className="h-5 w-5" />
                Pool Specific Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Pool specific costs and calculations will be displayed here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Fixed Costs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Fixed costs applied to all pools will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;

