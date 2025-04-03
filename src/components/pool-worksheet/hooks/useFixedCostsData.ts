
import { useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columnGroups, columnLabels } from '../column-config';

export const useFixedCostsData = () => {
  const { data: fixedCosts, isLoading: isLoadingFixedCosts } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      
      return data;
    }
  });

  // Update fixed costs columns when fixed costs are loaded
  useEffect(() => {
    if (fixedCosts && fixedCosts.length > 0) {
      // Find the fixed costs group
      const fixedCostsGroupIndex = columnGroups.findIndex(group => group.id === 'fixed_costs');
      
      if (fixedCostsGroupIndex !== -1) {
        // Update the columns with fixed cost column IDs and add the total column
        const fixedCostColumns = fixedCosts.map(cost => `fixed_cost_${cost.id}`);
        // Add fixed_costs_total as the last column in the fixed costs group
        columnGroups[fixedCostsGroupIndex].columns = [...fixedCostColumns, "fixed_costs_total"];
        
        // Update the column labels
        fixedCosts.forEach(cost => {
          columnLabels[`fixed_cost_${cost.id}`] = cost.name;
        });
      }
    }
  }, [fixedCosts]);

  // Calculate the total fixed costs
  const calculateFixedCostsTotal = () => {
    if (!fixedCosts) return 0;
    
    return fixedCosts.reduce((total, cost) => total + (cost.price || 0), 0);
  };

  return {
    fixedCosts,
    isLoadingFixedCosts,
    calculateFixedCostsTotal
  };
};
