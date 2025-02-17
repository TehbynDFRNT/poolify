
import { DashboardLayout } from "@/components/DashboardLayout";
import { Database, Filter, Construction, Droplets, Calculator, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
} from "@/components/ui/breadcrumb";

const DataSection = ({ icon: Icon, title, description, isActive = true, onClick }: { 
  icon: any, 
  title: string, 
  description: string,
  isActive?: boolean,
  onClick?: () => void 
}) => (
  <div 
    className={`bg-white rounded-xl p-6 shadow-sm border transition-all duration-200 ${
      isActive ? "hover:border-primary cursor-pointer" : "opacity-50 cursor-not-allowed"
    }`}
    onClick={isActive ? onClick : undefined}
  >
    <div className="flex items-start space-x-4">
      <div className="p-2 bg-primary/10 rounded-lg">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      {isActive && <PlusCircle className="h-5 w-5 text-primary" />}
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto animate-fadeIn">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              Dashboard
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
          <p className="text-gray-600">
            Manage and organize your pool construction and pricing data
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DataSection
            icon={Database}
            title="Pool Specifications"
            description="Manage pool types, sizes, and basic specifications"
            onClick={() => navigate('/pool-specifications')}
          />
          
          <DataSection
            icon={Filter}
            title="Filtration Systems"
            description="Configure filtration options and equipment specifications"
          />
          
          <DataSection
            icon={Construction}
            title="Construction Costs"
            description="Manage construction materials and associated costs"
            onClick={() => navigate('/construction-costs')}
          />
          
          <DataSection
            icon={Droplets}
            title="Water Features"
            description="Configure additional water features and accessories"
          />
          
          <DataSection
            icon={Calculator}
            title="Pricing Models"
            description="Set up pricing calculations and formulas"
          />
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 text-center">
            Select a category above to manage its data structure and content
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
