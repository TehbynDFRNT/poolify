
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";

const PricingWorksheet = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/pricing-models">Pricing Models</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>Pricing Worksheet</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Pricing Worksheet</h1>
            <p className="text-gray-500 mt-1">Calculate and manage comprehensive pricing models</p>
          </div>
          <Calculator className="h-6 w-6 text-gray-500" />
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Pool Specific Costs</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Content for pool specific costs will go here */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Excavation & Dig Costs</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Content for excavation costs will go here */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Paving & Retaining Costs</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Content for paving costs will go here */}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Additional Costs</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Content for additional costs like crane, traffic control, etc. */}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PricingWorksheet;
