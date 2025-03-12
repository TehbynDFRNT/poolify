
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { BarChart4, Construction, Building, Hammer, Wrench, Layers, Droplets } from "lucide-react";

const ConstructionCosts = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">Construction Costs</h1>
          <p className="text-gray-500">
            Manage construction costs including retaining walls, excavation, fixed costs, and individual pool costs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/construction-costs/excavation" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <Construction className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Excavation Costs</span>
            </div>
          </Link>

          <Link to="/construction-costs/fixed-costs" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <Building className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Fixed Costs</span>
            </div>
          </Link>

          <Link to="/construction-costs/retaining-walls" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <Wrench className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Retaining Walls</span>
            </div>
          </Link>

          <Link to="/construction-costs/bobcat-costs" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <Construction className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Bobcat Costs</span>
            </div>
          </Link>

          <Link to="/construction-costs/crane-costs" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <Hammer className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Crane Costs</span>
            </div>
          </Link>

          <Link to="/construction-costs/pool-individual-costs" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <BarChart4 className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Pool Individual Costs</span>
            </div>
          </Link>

          <Link to="/construction-costs/extra-paving" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <Layers className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Extra Paving</span>
            </div>
          </Link>

          <Link to="/construction-costs/water-feature" className="block">
            <div className="p-6 rounded-lg border border-gray-200 hover:border-primary transition-colors flex flex-col items-center justify-center">
              <Droplets className="h-6 w-6 text-primary mb-3" />
              <span className="font-medium">Water Feature</span>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConstructionCosts;
