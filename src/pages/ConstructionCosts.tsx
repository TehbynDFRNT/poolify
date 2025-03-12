
import { DashboardLayout } from "@/components/DashboardLayout";
import { Menu, Construction, Truck, Shovel, DollarSign } from "lucide-react";
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link 
            to="/construction-costs/excavation" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Excavation</h3>
                <p className="text-sm text-gray-500 mt-1">Manage dig types and excavation costs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Shovel className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>

          <Link 
            to="/construction-costs/retaining-walls" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Retaining Walls</h3>
                <p className="text-sm text-gray-500 mt-1">Manage retaining wall specifications and costs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Construction className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>

          <Link 
            to="/construction-costs/paving-retaining" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Paving & Concreting</h3>
                <p className="text-sm text-gray-500 mt-1">Manage paving and concrete costs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Construction className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>

          <Link 
            to="/construction-costs/bobcat-costs" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Bobcat Costs</h3>
                <p className="text-sm text-gray-500 mt-1">View and manage bobcat rental costs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Truck className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>

          <Link 
            to="/construction-costs/crane-costs" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Crane & Traffic Control</h3>
                <p className="text-sm text-gray-500 mt-1">Manage crane hire and traffic control costs</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <Construction className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>

          <Link 
            to="/construction-costs/fixed-costs" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Fixed Costs</h3>
                <p className="text-sm text-gray-500 mt-1">Manage fixed costs for all pool installations</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>

          <Link 
            to="/construction-costs/pool-individual-costs" 
            className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pool Individual Costs</h3>
                <p className="text-sm text-gray-500 mt-1">Manage additional costs for individual pool models</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConstructionCosts;
