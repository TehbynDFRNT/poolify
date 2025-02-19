
import { DashboardLayout } from "@/components/DashboardLayout";
import { List } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePools } from "@/hooks/usePools";

const PoolListing = () => {
  const { data: pools, isLoading } = usePools();

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>Home</BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Pool Listing</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle>Pool Listing</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p>Loading pools...</p>
            ) : (
              <div className="grid gap-4">
                {pools?.map((pool) => (
                  <Card key={pool.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{pool.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {pool.range} - {pool.length}m x {pool.width}m
                          </p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Depth: {pool.depth_shallow}m - {pool.depth_deep}m
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolListing;
