
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columnGroups, columnLabels } from '../column-config';
import { FixedCost } from '@/types/fixed-cost';

export const useFixedCostsData = () => {
  // State to track if columns have been updated
  const [columnsUpdated, setColumnsUpdated] = useState(false);

  const { data: fixedCosts, isLoading: isLoadingFixedCosts } = useQuery({
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

  // Update fixed costs columns when fixed costs are loaded
  useEffect(() => {
    if (fixedCosts && fixedCosts.length > 0 && !columnsUpdated) {
      // Find the fixed costs group
      const fixedCostsGroupIndex = columnGroups.findIndex(group => group.id === 'fixed_costs');
      
      if (fixedCostsGroupIndex !== -1) {
        // Update the columns with fixed cost column IDs
        const fixedCostColumns = fixedCosts.map(cost => `fixed_cost_${cost.id}`);
        
        // Add fixed_costs_total as the last column in the fixed costs group
        columnGroups[fixedCostsGroupIndex].columns = [...fixedCostColumns, "fixed_costs_total"];
        
        // Update the column labels in the columnLabels object
        fixedCosts.forEach(cost => {
          columnLabels[`fixed_cost_${cost.id}`] = cost.name;
        });
        
        // Make sure the fixed_costs_total label is set
        columnLabels["fixed_costs_total"] = "Fixed Costs Total";
        
        // Prevent multiple updates
        setColumnsUpdated(true);
        
        console.log("Fixed costs columns updated:", columnGroups[fixedCostsGroupIndex].columns);
      }
    }
  }, [fixedCosts, columnsUpdated]);

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
