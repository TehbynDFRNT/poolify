
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const Electrical = () => {
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
              <Link to="/third-party-costs/electrical" className="transition-colors hover:text-foreground">
                Electrical
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Electrical Costs</h1>
            <p className="text-gray-500 mt-1">Manage electrical contractor costs and requirements</p>
          </div>
          <Zap className="h-6 w-6 text-gray-500" />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <p className="text-gray-600">Configure electrical costs settings and requirements here.</p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Electrical;
