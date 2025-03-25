
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcretePump } from "@/pages/ConstructionCosts/hooks/useConcretePump";
import { toast } from "sonner";
import { PavingSelection } from "../types";
import { 
  calculateSelectionCost, 
  calculateTotalMargin, 
  calculateTotalCost,
  getSelectionsDebugInfo
} from "../utils/pavingCalculations";
import { fetchPavingSelections } from "../services/pavingService";

export const useExtraPavingQuote = (quoteId?: string) => {
  const [pavingSelections, setPavingSelections] = useState<PavingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { extraPavingCosts } = useExtraPavingCosts();
  const { concretePump } = useConcretePump();

  // Fetch existing selections for this quote
  useEffect(() => {
    if (!quoteId) return;

    const loadSelections = async () => {
      setIsLoading(true);
      try {
        const selections = await fetchPavingSelections(quoteId);
        console.log("Fetched selections:", selections);
        
        // Ensure all number fields are properly parsed as numbers
        const parsedSelections = selections.map(selection => ({
          ...selection,
          meters: selection.meters === undefined || isNaN(selection.meters) ? 0 : Number(selection.meters),
          totalCost: selection.totalCost === undefined || isNaN(selection.totalCost) ? 0 : Number(selection.totalCost)
        }));
        
        setPavingSelections(parsedSelections);
        
        // Calculate total cost
        const total = calculateTotalCost(parsedSelections);
        setTotalCost(total);
        
        console.log("Paving selections:", parsedSelections);
        console.log("Paving total cost:", total);
      } catch (error) {
        console.error("Error loading paving selections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSelections();
  }, [quoteId]);

  // Log selections after update for debugging
  useEffect(() => {
    console.log("Current paving selections:", pavingSelections);
    console.log("Selection details:", getSelectionsDebugInfo(pavingSelections));
  }, [pavingSelections]);

  // Add a new paving selection
  const addSelection = async (pavingId: string) => {
    if (!quoteId) {
      toast.error("No quote ID available. Cannot add paving selection.");
      return;
    }

    // Check if this paving type is already selected
    const existingSelection = pavingSelections.find(s => s.pavingId === pavingId);
    if (existingSelection) {
      // Don't show an error, this may be normal behavior when selecting from dropdown
      console.log("This paving type is already selected");
      return;
    }

    // Find the paving cost data
    const pavingData = extraPavingCosts?.find(p => p.id === pavingId);
    if (!pavingData) {
      toast.error("Paving type not found");
      return;
    }

    // Create new selection with empty meters that the user will fill in
    const newSelection: PavingSelection = {
      quoteId,
      pavingId,
      pavingCategory: pavingData.category,
      paverCost: pavingData.paver_cost,
      wastageCost: pavingData.wastage_cost,
      marginCost: pavingData.margin_cost,
      meters: 0, // Start with 0 meters
      totalCost: 0
    };

    // Calculate the total cost (will be 0 with 0 meters)
    newSelection.totalCost = calculateSelectionCost(newSelection);

    // Add to state
    const updatedSelections = [...pavingSelections, newSelection];
    setPavingSelections(updatedSelections);
    updateTotalCost(updatedSelections);
    
    console.log("Added new selection:", newSelection);
    console.log("Total cost after adding:", calculateTotalCost(updatedSelections));
  };

  // Update meters for a selection
  const updateSelectionMeters = (pavingId: string, meters: number) => {
    console.log(`Updating selection meters: pavingId=${pavingId}, meters=${meters}`);

    const updatedSelections = pavingSelections.map(selection => {
      if (selection.pavingId === pavingId) {
        const updatedSelection = {
          ...selection,
          meters: meters
        };
        
        // Recalculate the total cost
        updatedSelection.totalCost = calculateSelectionCost(updatedSelection);
        console.log(`Updated selection: meters=${updatedSelection.meters}, totalCost=${updatedSelection.totalCost}`);
        return updatedSelection;
      }
      return selection;
    });

    console.log("Updated selections:", updatedSelections);
    setPavingSelections(updatedSelections);
    updateTotalCost(updatedSelections);
  };

  // Remove a selection
  const removeSelection = (pavingId: string) => {
    const updatedSelections = pavingSelections.filter(selection => selection.pavingId !== pavingId);
    console.log("After removal:", updatedSelections);
    setPavingSelections(updatedSelections);
    updateTotalCost(updatedSelections);
  };

  // Update the total cost
  const updateTotalCost = (selections: PavingSelection[]) => {
    const total = calculateTotalCost(selections);
    console.log(`Total cost calculated: ${total}`);
    setTotalCost(total);
  };

  return {
    pavingSelections,
    totalCost,
    totalMargin: calculateTotalMargin(pavingSelections),
    isLoading,
    addSelection,
    updateSelectionMeters,
    removeSelection
  };
};
