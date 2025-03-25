
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { ConcreteLabourCost } from "@/types/concrete-labour-cost";

/**
 * Hook to fetch paving categories and concrete labour costs from the database
 */
export const usePavingData = () => {
  // Load extra paving categories from the database
  const { data: pavingCategories, isLoading: isLoadingPaving } = useQuery({
    queryKey: ["extra-paving-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extra_paving_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching extra paving costs:", error);
        throw error;
      }

      return data as ExtraPavingCost[];
    },
  });

  // Load concrete labour costs from the database
  const { data: concreteLabourCosts, isLoading: isLoadingLabour } = useQuery({
    queryKey: ["concrete-labour-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_labour_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching concrete labour costs:", error);
        throw error;
      }

      return data as ConcreteLabourCost[];
    },
  });

  const isLoading = isLoadingPaving || isLoadingLabour;

  return {
    pavingCategories,
    concreteLabourCosts,
    isLoading
  };
};
