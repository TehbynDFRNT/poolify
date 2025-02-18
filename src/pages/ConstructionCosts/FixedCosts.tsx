
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DollarSign } from "lucide-react";
import { CostSection } from "./components/CostSection";
import { AddFixedCostForm } from "./components/AddFixedCostForm";
import { useCosts } from "./hooks/useCosts";
import type { FixedCost } from "@/types/fixed-cost";

const FixedCosts = () => {
  const {
    costs,
    isLoading,
    editingId,
    editingPrice,
    isAdding,
    setIsAdding,
    startEditing,
    handleSave,
    handleCancel,
    setEditingPrice,
  } = useCosts("fixed_costs", "fixed-costs");

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/construction-costs/fixed-costs" className="transition-colors hover:text-foreground">
                Fixed Costs
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Fixed Costs</h1>
            <p className="text-gray-500 mt-1">Manage fixed costs that apply to every pool installation</p>
          </div>
          <DollarSign className="h-6 w-6 text-gray-500" />
        </div>

        <CostSection
          title="Fixed Costs"
          nameLabel="Item"
          costs={costs as FixedCost[]}
          isLoading={isLoading}
          isAdding={isAdding}
          editingId={editingId}
          editingPrice={editingPrice}
          onAddToggle={() => setIsAdding(!isAdding)}
          onEdit={startEditing}
          onSave={handleSave}
          onCancel={handleCancel}
          onPriceChange={setEditingPrice}
          AddForm={AddFixedCostForm}
        />
      </div>
    </DashboardLayout>
  );
};

export default FixedCosts;
