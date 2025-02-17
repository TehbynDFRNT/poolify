
import { DashboardLayout } from "@/components/DashboardLayout";
import { Shovel, Truck, Hammer, Ruler, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DataSectionProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
}

const DataSection = ({ 
  icon,
  title, 
  description, 
  isActive = true, 
  onClick 
}: DataSectionProps) => (
  <div 
    className={`bg-white rounded-[20px] p-8 transition-all duration-200 ${
      isActive 
        ? "hover:shadow-md cursor-pointer border border-gray-100" 
        : "opacity-50 cursor-not-allowed"
    }`}
    onClick={isActive ? onClick : undefined}
  >
    <div className="flex items-start justify-between">
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-primary/10 rounded-xl">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {isActive && (
        <div className="text-primary">
          <Plus className="h-5 w-5" />
        </div>
      )}
    </div>
  </div>
);

const ConstructionCosts = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto py-8 px-4 animate-fadeIn">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Construction Costs</h1>
          <p className="text-lg text-gray-500">
            Manage and organize your pool construction costs
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <DataSection
            icon={<Shovel className="h-6 w-6 text-primary" />}
            title="Excavation"
            description="Manage excavation costs and dig types"
            onClick={() => navigate('/excavation')}
          />
          
          <DataSection
            icon={<Truck className="h-6 w-6 text-primary" />}
            title="Bobcat Costs"
            description="View and manage bobcat rental costs"
            onClick={() => navigate('/bobcat-costs')}
          />
          
          <DataSection
            icon={<Hammer className="h-6 w-6 text-primary" />}
            title="Labor"
            description="Set up labor costs and time estimates"
            isActive={false}
          />
          
          <DataSection
            icon={<Ruler className="h-6 w-6 text-primary" />}
            title="Measurements"
            description="Define measurement costs and calculations"
            isActive={false}
          />
        </div>

        <div className="mt-12 text-center py-6 px-4 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-gray-500">
            Select a category above to manage its costs and specifications
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConstructionCosts;
