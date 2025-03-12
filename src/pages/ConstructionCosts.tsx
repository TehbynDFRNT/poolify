
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart4 } from "lucide-react";

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
          <Link to="/construction-costs/excavation">
            <Button
              variant="outline"
              className="w-full h-32 border border-gray-200 hover:border-primary flex flex-col space-y-3 items-center justify-center"
            >
              <BarChart4 className="h-8 w-8" />
              <span>Excavation Costs</span>
            </Button>
          </Link>

          <Link to="/construction-costs/fixed-costs">
            <Button
              variant="outline"
              className="w-full h-32 border border-gray-200 hover:border-primary flex flex-col space-y-3 items-center justify-center"
            >
              <BarChart4 className="h-8 w-8" />
              <span>Fixed Costs</span>
            </Button>
          </Link>

          <Link to="/construction-costs/retaining-walls">
            <Button
              variant="outline"
              className="w-full h-32 border border-gray-200 hover:border-primary flex flex-col space-y-3 items-center justify-center"
            >
              <BarChart4 className="h-8 w-8" />
              <span>Retaining Walls</span>
            </Button>
          </Link>

          <Link to="/construction-costs/bobcat-costs">
            <Button
              variant="outline"
              className="w-full h-32 border border-gray-200 hover:border-primary flex flex-col space-y-3 items-center justify-center"
            >
              <BarChart4 className="h-8 w-8" />
              <span>Bobcat Costs</span>
            </Button>
          </Link>

          <Link to="/construction-costs/crane-costs">
            <Button
              variant="outline"
              className="w-full h-32 border border-gray-200 hover:border-primary flex flex-col space-y-3 items-center justify-center"
            >
              <BarChart4 className="h-8 w-8" />
              <span>Crane Costs</span>
            </Button>
          </Link>

          <Link to="/construction-costs/pool-individual-costs">
            <Button
              variant="outline"
              className="w-full h-32 border border-gray-200 hover:border-primary flex flex-col space-y-3 items-center justify-center"
            >
              <BarChart4 className="h-8 w-8" />
              <span>Pool Individual Costs</span>
            </Button>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ConstructionCosts;
