
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Fence } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Fencing = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/third-party-costs" className="transition-colors hover:text-foreground">
                Third Party Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/third-party-costs/fencing" className="transition-colors hover:text-foreground">
                Fencing
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-gray-50 p-8 rounded-full mb-6">
            <Fence className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Fencing Section</h1>
          <p className="text-gray-500 max-w-md">
            This section will contain fencing specifications and cost configurations. 
            Coming soon.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Fencing;
