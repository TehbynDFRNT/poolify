
import { DashboardLayout } from "@/components/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
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

        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">{pool.name}</h1>
          <div className="space-y-4">
            <div>
              <span className="font-semibold">Range:</span> {pool.range}
            </div>
            <div>
              <span className="font-semibold">Dimensions:</span> {pool.length}m × {pool.width}m
            </div>
            <div>
              <span className="font-semibold">Depth:</span> {pool.depth_shallow}m - {pool.depth_deep}m
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolPricing;
