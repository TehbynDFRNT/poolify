
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
import { ConcreteCutsTable } from "./components/ConcreteCutsTable";
import { UnderFenceConcreteTable } from "./components/UnderFenceConcreteTable";
import type { PavingPrice } from "@/types/paving-price";
import type { PavingAdditionalCost } from "@/types/paving-additional-cost";
import type { ConcreteCut } from "@/types/concrete-cut";

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

  const { data: concreteCuts, isLoading: isCutsLoading } = useQuery({
    queryKey: ["concrete-cuts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_cuts")
        .select("*")
        .eq("category", null);  // Changed from .is() to .eq() to fix the TypeScript error

      if (error) {
        throw error;
      }

      // Custom sort order: 1/4 Pool, 1/2 Pool, 3/4 Pool, Full Pool, then any others like Diagonal Cuts
      const sortOrder = {
        "1/4 Pool": 1,
        "1/2 Pool": 2,
        "3/4 Pool": 3,
        "Full Pool": 4,
        "Diagonal Cuts": 5
      };

      return (data as ConcreteCut[]).sort((a, b) => {
        const orderA = sortOrder[a.type] || 99; // Default high number for unknown types
        const orderB = sortOrder[b.type] || 99;
        return orderA - orderB;
      });
    },
  });

  const { data: underFenceConcrete, isLoading: isUnderFenceLoading } = useQuery({
    queryKey: ["under-fence-concrete"],
    queryFn: async () => {
      // First, check if we already have data
      const { data: existingData, error: checkError } = await supabase
        .from("concrete_cuts")
        .select("*")
        .eq("category", "under_fence");

      if (checkError) {
        throw checkError;
      }

      // If we don't have any data, insert the default values
      if (!existingData || existingData.length === 0) {
        const defaultValues = [
          { type: "Plain Concrete", price: 150, margin: 35, category: "under_fence" },
          { type: "Paved Concrete", price: 220, margin: 60, category: "under_fence" }
        ];

        const { error: insertError } = await supabase
          .from("concrete_cuts")
          .insert(defaultValues);

        if (insertError) {
          throw insertError;
        }

        // Fetch the newly inserted data
        const { data: newData, error: fetchError } = await supabase
          .from("concrete_cuts")
          .select("*")
          .eq("category", "under_fence");

        if (fetchError) {
          throw fetchError;
        }

        return newData as ConcreteCut[];
      }

      return existingData as ConcreteCut[];
    },
  });

  const isLoading = isPricesLoading || isCostsLoading || isCutsLoading || isUnderFenceLoading;

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
                Paving & Concreting
              </Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Paving & Concreting</h1>
            <p className="text-gray-500 mt-1">Manage paving and concrete specifications and pricing</p>
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
              {concreteCuts && <ConcreteCutsTable cuts={concreteCuts} />}
              {underFenceConcrete && <UnderFenceConcreteTable cuts={underFenceConcrete} />}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PavingRetaining;
