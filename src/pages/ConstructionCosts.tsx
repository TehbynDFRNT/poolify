
import { DashboardLayout } from "@/components/DashboardLayout";
import { Menu, Construction } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ConstructionCosts = () => {
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
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Construction Costs</h1>
            <p className="text-gray-500 mt-1">Manage your construction and excavation costs</p>
          </div>
          <Menu className="h-6 w-6 text-gray-500" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Link 
            to="/excavation" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Excavation</h3>
                <p className="text-sm text-gray-500 mt-1">Manage dig types and excavation costs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <svg 
                  className="h-6 w-6 text-gray-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
            </div>
          </Link>

          <Link 
            to="/paving-retaining" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Paving & Retaining</h3>
                <p className="text-sm text-gray-500 mt-1">Manage paving and retaining wall costs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Construction className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConstructionCosts;
