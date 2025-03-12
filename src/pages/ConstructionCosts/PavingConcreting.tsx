
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const PavingConcreting = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs/paving-concreting" className="transition-colors hover:text-foreground">
                Paving & Concreting
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Paving & Concreting</h1>
            <p className="text-gray-500 mt-1">Manage paving and concrete costs</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Paving Costs</CardTitle>
              <CardDescription>Set up and manage paving costs for pool installations</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Construction className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No paving costs defined yet</p>
                <p className="text-sm text-gray-400 mt-1">Add paving costs to get started</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Concrete Costs</CardTitle>
              <CardDescription>Set up and manage concrete costs for pool installations</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center p-6">
              <div className="text-center">
                <Construction className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No concrete costs defined yet</p>
                <p className="text-sm text-gray-400 mt-1">Add concrete costs to get started</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PavingConcreting;
