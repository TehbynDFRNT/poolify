
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Waves } from "lucide-react";

const PoolBuilder = () => {
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
              Pool Builder
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Pool Builder</h1>
          <p className="text-muted-foreground mt-1">
            Design and customize swimming pools
          </p>
        </div>

        <Card className="p-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Waves className="h-16 w-16 text-primary mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Start Building Your Pool</h2>
            <p className="text-muted-foreground max-w-md mb-6">
              This is a placeholder for the Pool Builder feature. Future functionality will allow you to design and customize swimming pools in detail.
            </p>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PoolBuilder;
