
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { toast } from "sonner";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { PavingSelection } from "../types";
import { 
  calculateSelectionCost, 
  calculateTotalMargin, 
  calculateTotalCost 
} from "../utils/pavingCalculations";
import { 
  fetchPavingSelections, 
  savePavingSelections 
} from "../services/pavingService";

export const useExtraPavingQuote = (quoteId?: string) => {
  const [pavingSelections, setPavingSelections] = useState<PavingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { extraPavingCosts } = useExtraPavingCosts();
  const { updateQuoteData } = useQuoteContext();

  // Fetch existing selections for this quote
  useEffect(() => {
    if (!quoteId) return;

    const loadSelections = async () => {
      setIsLoading(true);
      try {
        const selections = await fetchPavingSelections(quoteId);
        setPavingSelections(selections);
        
        // Calculate total cost
        const total = calculateTotalCost(selections);
        setTotalCost(total);
      } finally {
        setIsLoading(false);
      }
    };

    loadSelections();
  }, [quoteId]);

  // Add a new paving selection
  const addSelection = async (pavingId: string) => {
    if (!quoteId) {
      toast.error("No quote ID available. Cannot add paving selection.");
      return;
    }

    // Check if this paving type is already selected
    const existingSelection = pavingSelections.find(s => s.pavingId === pavingId);
    if (existingSelection) {
      toast.error("This paving type is already selected");
      return;
    }

    // Find the paving cost data
    const pavingData = extraPavingCosts?.find(p => p.id === pavingId);
    if (!pavingData) {
      toast.error("Paving type not found");
      return;
    }

    // Create new selection with default 10 meters (matching the design)
    const newSelection: PavingSelection = {
      quoteId,
      pavingId,
      pavingCategory: pavingData.category,
      paverCost: pavingData.paver_cost,
      wastageCost: pavingData.wastage_cost,
      marginCost: pavingData.margin_cost,
      meters: 10,
      totalCost: 0
    };

    // Calculate the total cost
    newSelection.totalCost = calculateSelectionCost(newSelection);

    // Add to state
    const updatedSelections = [...pavingSelections, newSelection];
    setPavingSelections(updatedSelections);
    updateTotalCost(updatedSelections);
  };

  // Update meters for a selection
  const updateSelectionMeters = (pavingId: string, meters: number) => {
    if (meters < 0) {
      toast.error("Meters cannot be negative");
      return;
    }

    const updatedSelections = pavingSelections.map(selection => {
      if (selection.pavingId === pavingId) {
        const updatedSelection = {
          ...selection,
          meters
        };
        updatedSelection.totalCost = calculateSelectionCost(updatedSelection);
        return updatedSelection;
      }
      return selection;
    });

    setPavingSelections(updatedSelections);
    updateTotalCost(updatedSelections);
  };

  // Remove a selection
  const removeSelection = (pavingId: string) => {
    const updatedSelections = pavingSelections.filter(selection => selection.pavingId !== pavingId);
    setPavingSelections(updatedSelections);
    updateTotalCost(updatedSelections);
  };

  // Update the total cost
  const updateTotalCost = (selections: PavingSelection[]) => {
    const total = calculateTotalCost(selections);
    setTotalCost(total);
  };

  // Save all selections to the database
  const saveSelections = async () => {
    if (!quoteId) {
      toast.error("No quote ID available. Cannot save paving selections.");
      return;
    }

    try {
      await savePavingSelections(quoteId, pavingSelections, totalCost);
      
      // Update the context with the new total
      updateQuoteData({ 
        extra_paving_cost: totalCost 
      });

      return true;
    } catch (error) {
      console.error("Error saving paving selections:", error);
      throw error;
    }
  };

  return {
    pavingSelections,
    totalCost,
    totalMargin: calculateTotalMargin(pavingSelections),
    isLoading,
    addSelection,
    updateSelectionMeters,
    removeSelection,
    saveSelections
  };
};
