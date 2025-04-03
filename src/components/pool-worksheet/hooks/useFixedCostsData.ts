
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columnGroups, columnLabels, defaultFixedCostColumns } from '../column-config';
import { FixedCost } from '@/types/fixed-cost';

export const useFixedCostsData = () => {
  // Create a cache for fixed cost columns to avoid repeated setup
  const [fixedCostColumnsSetup, setFixedCostColumnsSetup] = useState(false);

  const { data: fixedCosts, isLoading: isLoadingFixedCosts } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");
      
      if (error) throw error;
      
      console.log("Fetched fixed costs:", data);
      return data as FixedCost[];
    }
  });

  // Update fixed costs columns when fixed costs are loaded
  useEffect(() => {
    // Skip if columns are already set up or if we don't have data yet
    if (fixedCostColumnsSetup || !fixedCosts || fixedCosts.length === 0) return;

    console.log("Setting up fixed cost columns");
    
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
      
      console.log("Fixed costs columns updated:", columnGroups[fixedCostsGroupIndex].columns);
      setFixedCostColumnsSetup(true);
    }
  }, [fixedCosts, fixedCostColumnsSetup]);

  // If we have no columns but we have fixed costs, force setup
  useEffect(() => {
    const fixedCostsGroup = columnGroups.find(group => group.id === 'fixed_costs');
    if (fixedCostsGroup && fixedCostsGroup.columns.length === 0 && fixedCostColumnsSetup) {
      // Reset the setup flag to try again
      setFixedCostColumnsSetup(false);
    }
  }, [fixedCostColumnsSetup]);

  // Calculate the total fixed costs
  const calculateFixedCostsTotal = () => {
    if (!fixedCosts) return 0;
    
    return fixedCosts.reduce((total, cost) => total + (cost.price || 0), 0);
  };

  return {
    fixedCosts,
    isLoadingFixedCosts,
    calculateFixedCostsTotal,
    fixedCostColumnsSetup
  };
};
