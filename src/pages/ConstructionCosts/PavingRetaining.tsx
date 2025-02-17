
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
import { Construction } from "lucide-react";
import { PavingPricesTable } from "./components/PavingPricesTable";
import { PavingAdditionalCostsTable } from "./components/PavingAdditionalCostsTable";
import type { PavingPrice } from "@/types/paving-price";
import type { PavingAdditionalCost } from "@/types/paving-additional-cost";

const PavingRetaining = () => {
  const { data: pavingPrices, isLoading: isPricesLoading } = useQuery({
    queryKey: ["paving-prices"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paving_prices")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      return data as PavingPrice[];
    },
  });

  const { data: additionalCosts, isLoading: isCostsLoading } = useQuery({
    queryKey: ["paving-additional-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paving_additional_costs")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      return data as PavingAdditionalCost[];
    },
  });

  const isLoading = isPricesLoading || isCostsLoading;

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
              <Link to="/paving-retaining" className="transition-colors hover:text-foreground">
                Paving & Retaining
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Paving & Retaining</h1>
            <p className="text-gray-500 mt-1">Manage paving and retaining wall specifications</p>
          </div>
          <Construction className="h-6 w-6 text-gray-500" />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Paving Prices</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading prices...</p>
          ) : (
            <>
              {pavingPrices && <PavingPricesTable prices={pavingPrices} />}
              {additionalCosts && <PavingAdditionalCostsTable costs={additionalCosts} />}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PavingRetaining;
