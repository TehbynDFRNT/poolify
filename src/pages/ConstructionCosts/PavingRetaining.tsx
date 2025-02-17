
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Construction } from "lucide-react";

const PavingRetaining = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
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
              <Link to="/paving-retaining" className="transition-colors hover:text-foreground">
                Paving & Retaining
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Paving & Retaining</h1>
            <p className="text-gray-500 mt-1">Manage paving and retaining wall specifications</p>
          </div>
          <Construction className="h-6 w-6 text-gray-500" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Coming Soon</h2>
            <p className="text-gray-500">Paving and retaining wall management features will be available soon.</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PavingRetaining;
