
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ElectricalCostsTable } from "./components/ElectricalCostsTable";
import { useElectricalCosts } from "./hooks/useElectricalCosts";

const Electrical = () => {
  const { isLoading } = useElectricalCosts();
  const [isAdding, setIsAdding] = useState(false);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

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
          <Button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>

        <ElectricalCostsTable isAdding={isAdding} setIsAdding={setIsAdding} />
      </div>
    </DashboardLayout>
  );
};

export default Electrical;
