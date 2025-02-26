
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { Construction } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { RetainingWallsCostsTable } from "./components/RetainingWallsCostsTable";
import { useRetainingWalls } from "./hooks/useRetainingWalls";

const RetainingWalls = () => {
  const { retainingWalls, updateMutation, addMutation } = useRetainingWalls();

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
              <Link to="/construction-costs" className="transition-colors hover:text-foreground">
                Construction Costs
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs/retaining-walls" className="transition-colors hover:text-foreground">
                Retaining Walls
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Retaining Walls</h1>
          <p className="text-gray-500">
            Manage your retaining wall types and their pricing here. All prices are in AUD.
          </p>
        </div>

        <div className="space-y-6">
          <RetainingWallsCostsTable
            costs={retainingWalls || []}
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

export default RetainingWalls;
