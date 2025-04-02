
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PoolSpecificationsTable } from "@/components/worksheets/PoolSpecificationsTable";

const PoolWorksheet = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Pool Worksheet
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Pool Worksheet</h1>
          <p className="text-muted-foreground mt-1">
            A comprehensive breakdown of all pool-related charges and specifications
          </p>
        </div>
        
        <div className="space-y-8">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Pool Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <PoolSpecificationsTable />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
