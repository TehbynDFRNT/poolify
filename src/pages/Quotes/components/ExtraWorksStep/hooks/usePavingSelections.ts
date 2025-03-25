
import { useState, useEffect, useCallback } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { usePavingData } from "./usePavingData";
import { calculatePavingCosts, calculateTotals } from "./usePavingCostCalculator";

export interface PavingSelection {
  categoryId: string;
  meters: number;
  cost: number;
  materialMargin?: number;
  labourMargin?: number;
  totalMargin?: number;
}

/**
 * Hook to manage paving selections and handle saving/loading
 */
export const usePavingSelections = () => {
  const { quoteData } = useQuoteContext();
  const { pavingCategories, concreteLabourCosts, isLoading } = usePavingData();
  const [pavingSelections, setPavingSelections] = useState<PavingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  
  // Load saved paving selections
  const loadSavedSelections = useCallback((customRequirementsJson?: string) => {
    if (!customRequirementsJson || customRequirementsJson === '') {
      console.log("No custom requirements JSON to load");
      return;
    }
    
    try {
      const extraWorksData = JSON.parse(customRequirementsJson);
      
      // Check if pavingSelections exists, is an array, and has items
      if (extraWorksData && 
          extraWorksData.pavingSelections && 
          Array.isArray(extraWorksData.pavingSelections) && 
          extraWorksData.pavingSelections.length > 0) {
        
        console.log("Loading saved paving selections:", extraWorksData.pavingSelections);
        
        // Make sure all required fields exist in each saved selection
        const validSelections = extraWorksData.pavingSelections.filter((selection: any) => {
          return selection && 
                 typeof selection.categoryId === 'string' && 
                 typeof selection.meters === 'number';
        });
        
        if (validSelections.length > 0) {
          console.log("Valid selections to set:", validSelections);
          
          // Calculate costs for each valid selection to make sure all values are set
          const calculatedSelections = validSelections.map((selection: PavingSelection) => {
            if (pavingCategories && pavingCategories.length > 0) {
              return calculatePavingCosts(
                selection,
                pavingCategories,
                concreteLabourCosts
              );
            }
            return selection;
          });
          
          setPavingSelections(calculatedSelections);
        } else {
          console.log("No valid selections found after filtering");
          setPavingSelections([]);
        }
      } else {
        console.log("No valid paving selections found in saved data");
        setPavingSelections([]);
      }
    } catch (error) {
      console.error("Error parsing saved paving selections:", error);
      setPavingSelections([]);
    }
  }, [pavingCategories, concreteLabourCosts]);

  // Add a new paving selection
  const addPavingSelection = () => {
    if (pavingCategories && pavingCategories.length > 0) {
      const newSelection: PavingSelection = {
        categoryId: pavingCategories[0].id,
        meters: 0,
        cost: 0,
        materialMargin: 0,
        labourMargin: 0,
        totalMargin: 0
      };
      setPavingSelections(prev => [...prev, newSelection]);
    }
  };

  // Update a paving selection and recalculate costs
  const updatePavingSelection = (index: number, updates: Partial<PavingSelection>) => {
    setPavingSelections(prevSelections => {
      // Create a new array to trigger state update
      const updatedSelections = [...prevSelections];
      
      // Ensure index is valid
      if (index < 0 || index >= updatedSelections.length) {
        console.error(`Invalid selection index: ${index}`);
        return prevSelections;
      }
      
      // Update the selection with new values
      updatedSelections[index] = { ...updatedSelections[index], ...updates };
      
      // Recalculate cost if meters or category changed
      if (updates.meters !== undefined || updates.categoryId !== undefined) {
        updatedSelections[index] = calculatePavingCosts(
          updatedSelections[index],
          pavingCategories,
          concreteLabourCosts
        );
        
        // Log the update for debugging
        console.log(`Updated paving selection: meters=${updatedSelections[index].meters} totalPerMeter=${costPerMeter(updatedSelections[index])} totalCost=${updatedSelections[index].cost}`);
      }
      
      return updatedSelections;
    });
  };

  // Helper function to calculate cost per meter
  const costPerMeter = (selection: PavingSelection): number => {
    if (selection.meters <= 0) return 0;
    return selection.cost / selection.meters;
  };

  // Remove a paving selection
  const removePavingSelection = (index: number) => {
    setPavingSelections(prev => prev.filter((_, i) => i !== index));
  };

  // Calculate total cost and margin whenever selections change
  useEffect(() => {
    const { totalCost: newTotalCost, totalMargin: newTotalMargin } = calculateTotals(pavingSelections);
    
    console.log("Paving selections changed, new total cost:", newTotalCost);
    console.log("Selections:", pavingSelections);
    
    setTotalCost(newTotalCost);
    setTotalMargin(newTotalMargin);
  }, [pavingSelections]);

  // Load saved data when component mounts or customRequirements changes
  useEffect(() => {
    if (quoteData.custom_requirements_json && !initialLoadDone && pavingCategories && pavingCategories.length > 0) {
      loadSavedSelections(quoteData.custom_requirements_json);
      setInitialLoadDone(true);
    }
  }, [quoteData.custom_requirements_json, loadSavedSelections, initialLoadDone, pavingCategories]);

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
    loadSavedSelections
  };
};
