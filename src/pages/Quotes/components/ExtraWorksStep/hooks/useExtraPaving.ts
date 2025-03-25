
import { useRef, useState, useEffect } from "react";
import { usePavingSelections } from "./usePavingSelections";
import type { PavingSelection } from "./usePavingSelections";

/**
 * Main hook for handling extra paving functionality in the quote system.
 * Integrates data fetching, selection management, and cost calculations.
 */
export const useExtraPaving = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [extraWorksRef, setExtraWorksRef] = useState<React.RefObject<any> | null>(null);
  
  const { 
    pavingCategories,
    concreteLabourCosts,
    pavingSelections,
    isLoading,
    totalCost,
    totalMargin,
    addPavingSelection,
    updatePavingSelection,
    removePavingSelection,
    loadSavedSelections
  } = usePavingSelections();

  // Update container attributes for external access to cost data
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute('data-cost', totalCost.toString());
      containerRef.current.setAttribute('data-margin', totalMargin.toString());
    }
  }, [totalCost, totalMargin]);

  return {
    pavingCategories,
    concreteLabourCosts,
    pavingSelections,
    isLoading,
    totalCost,
    totalMargin,
    addPavingSelection,
    updatePavingSelection,
    removePavingSelection,
    containerRef,
    loadSavedSelections,
    setExtraWorksRef,
    extraWorksRef
  };
};

// Re-export the PavingSelection type for use in other components
export type { PavingSelection };
