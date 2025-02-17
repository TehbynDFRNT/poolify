
import { DashboardLayout } from "@/components/DashboardLayout";
import { Menu } from "lucide-react";

const ConstructionCosts = () => {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Construction Costs</h1>
            <p className="text-gray-500 mt-1">Manage your construction and excavation costs</p>
          </div>
          <Menu className="h-6 w-6 text-gray-500" />
        </div>

        <div className="grid gap-6">
          <a 
            href="/excavation" 
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
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConstructionCosts;
