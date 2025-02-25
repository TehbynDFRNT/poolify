
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Fence, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FencingCostsTable } from "./components/FencingCostsTable";
import { useFencingCosts } from "./hooks/useFencingCosts";
import { toast } from "sonner";

const Fencing = () => {
  const { fencingCosts, updateMutation, addMutation } = useFencingCosts();

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
              <Link to="/third-party-costs/fencing" className="transition-colors hover:text-foreground">
                Fencing
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Fencing Components</h1>
          <p className="text-gray-500">
            Manage your fencing components and their pricing here. All prices are in AUD.
          </p>
        </div>

        <div className="space-y-6">
          <FencingCostsTable
            costs={fencingCosts || []}
            onUpdate={(id, updates) => {
              updateMutation.mutate({ id, updates });
            }}
            onAdd={(cost) => {
              addMutation.mutate(cost);
            }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Fencing;
