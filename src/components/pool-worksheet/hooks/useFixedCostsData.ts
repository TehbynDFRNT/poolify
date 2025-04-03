
import { useEffect, useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { columnGroups, columnLabels, defaultFixedCostColumns } from '../column-config';
import { FixedCost } from '@/types/fixed-cost';
import { toast } from 'sonner';

export const useFixedCostsData = () => {
  const [fixedCostColumnsSetup, setFixedCostColumnsSetup] = useState(false);

  // Fetch fixed costs from Supabase
  const { data: fixedCosts, isLoading: isLoadingFixedCosts, error } = useQuery({
    queryKey: ["fixed-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fixed_costs")
        .select("*")
        .order("display_order");
      
      if (error) {
        console.error("Error fetching fixed costs:", error);
        throw error;
      }
      
      console.log("Fetched fixed costs:", data);
      return data as FixedCost[];
    },
    meta: {
      onSettled: (data, error) => {
        if (error) {
          toast.error("Failed to load fixed costs");
        }
      }
    }
  });

  // Set up columns when data is loaded
  useEffect(() => {
    // Skip if no data or if already set up
    if (!fixedCosts || fixedCosts.length === 0) {
      console.log("No fixed costs data available yet");
      return;
    }

    console.log("Setting up fixed cost columns with data:", fixedCosts);
    
    // Find the fixed costs group
    const fixedCostsGroupIndex = columnGroups.findIndex(group => group.id === 'fixed_costs');
    
    if (fixedCostsGroupIndex === -1) {
      console.error("Fixed costs group not found in columnGroups");
      return;
    }

    // Create column IDs from fixed costs data
    const fixedCostColumns = fixedCosts.map(cost => `fixed_cost_${cost.id}`);
    
    // Always include the total column
    const allColumns = [...fixedCostColumns, "fixed_costs_total"];
    
    // Update the columns array
    columnGroups[fixedCostsGroupIndex].columns = allColumns;
    
    // Update column labels
    fixedCosts.forEach(cost => {
      columnLabels[`fixed_cost_${cost.id}`] = cost.name;
    });
    
    // Make sure total label is set
    columnLabels["fixed_costs_total"] = "Fixed Costs Total";
    
    console.log("Updated fixed costs columns:", columnGroups[fixedCostsGroupIndex].columns);
    setFixedCostColumnsSetup(true);
    
    // Force the global columnNumberMap to be recalculated
    // This uses a custom event to notify the TableHeader component
    setTimeout(() => {
      console.log("Dispatching fixedCostsUpdated event");
      const event = new CustomEvent('fixedCostsUpdated');
      window.dispatchEvent(event);
    }, 100); // Slightly longer timeout to ensure all data is processed
  }, [fixedCosts]);

  // Calculate the total of all fixed costs
  const calculateFixedCostsTotal = () => {
    if (!fixedCosts || fixedCosts.length === 0) return 0;
    return fixedCosts.reduce((total, cost) => total + (cost.price || 0), 0);
  };

  // Return all necessary data and functions
  return {
    fixedCosts,
    isLoadingFixedCosts,
    calculateFixedCostsTotal,
    fixedCostColumnsSetup,
    error
  };
};
