
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoolData } from "./hooks/usePoolData";

const PoolPricing = () => {
  const { poolId } = useParams<{ poolId: string }>();
  const navigate = useNavigate();
  
  if (!poolId) {
    navigate('/price-builder');
    return null;
  }

  const { data: pool, isLoading, error } = usePoolData(poolId);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 space-y-8">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !pool) {
    return (
      <DashboardLayout>
        <div className="container mx-auto py-8 space-y-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => navigate('/price-builder')}>Price Builder</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>Error</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Card className="p-6">
            <p className="text-red-500">Failed to load pool details. Please try again.</p>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/price-builder')}>Price Builder</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>{pool.name}</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{pool.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Range</h3>
                  <p>{pool.range}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Dimensions</h3>
                  <p>{pool.length}m × {pool.width}m</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Depth</h3>
                  <p>{pool.depth_shallow}m - {pool.depth_deep}m</p>
                </div>

                {pool.volume_liters && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Volume</h3>
                    <p>{pool.volume_liters.toLocaleString()} L</p>
                  </div>
                )}

                {pool.waterline_l_m && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Waterline</h3>
                    <p>{pool.waterline_l_m} L/m</p>
                  </div>
                )}

                {(pool.buy_price_ex_gst || pool.buy_price_inc_gst) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Buy Price</h3>
                    {pool.buy_price_ex_gst && <p>Ex GST: ${pool.buy_price_ex_gst.toLocaleString()}</p>}
                    {pool.buy_price_inc_gst && <p>Inc GST: ${pool.buy_price_inc_gst.toLocaleString()}</p>}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;
