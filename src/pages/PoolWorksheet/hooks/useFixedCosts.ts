
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FixedCost } from "@/types/fixed-cost";

export const useFixedCosts = () => {
  return useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      
      return data as FixedCost[];
    }
  });
};

export const useFixedCostTotal = (fixedCosts?: FixedCost[]) => {
  if (!fixedCosts || fixedCosts.length === 0) return 0;
  return fixedCosts.reduce((total, cost) => total + (cost.price || 0), 0);
};
