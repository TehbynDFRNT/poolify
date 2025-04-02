
import { useState, useEffect } from "react";
import { columnGroups } from "../constants";
import { FixedCost } from "@/types/fixed-cost";

export const useVisibleColumns = (fixedCosts?: FixedCost[]) => {
  const [visibleGroups, setVisibleGroups] = useState<string[]>(
    columnGroups.map(group => group.id) // Initially all groups are visible
  );

  // Update fixed costs columns when fixed costs are loaded
  useEffect(() => {
    if (fixedCosts && fixedCosts.length > 0) {
      // Find the fixed costs group
      const fixedCostsGroupIndex = columnGroups.findIndex(group => group.id === 'fixed_costs');
      
      if (fixedCostsGroupIndex !== -1) {
        // Update the columns with fixed cost column IDs
        const fixedCostColumns = fixedCosts.map(cost => `fixed_cost_${cost.id}`);
        columnGroups[fixedCostsGroupIndex].columns = fixedCostColumns;
      }
    }
  }, [fixedCosts]);

  // Get all visible column groups with their columns
  const visibleColumnGroups = columnGroups.filter(group => 
    visibleGroups.includes(group.id)
  );

  // Get all columns from visible groups
  const getVisibleColumns = () => {
    return columnGroups
      .filter(group => visibleGroups.includes(group.id))
      .flatMap(group => group.columns);
  };

  return {
    visibleGroups,
    setVisibleGroups,
    visibleColumnGroups,
    getVisibleColumns
  };
};
