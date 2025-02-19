
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const PricingModels = () => {
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
            <BreadcrumbItem>Pricing Models</BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mt-8">
          <h1 className="text-2xl font-semibold text-gray-900">Pricing Models</h1>
          <p className="mt-2 text-gray-500">
            Manage and calculate pricing for pools and related services.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PricingModels;
