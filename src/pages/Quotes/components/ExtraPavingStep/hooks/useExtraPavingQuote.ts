
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { toast } from "sonner";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export interface PavingSelection {
  id?: string;
  quoteId: string;
  pavingId: string;
  pavingCategory: string;
  paverCost: number;
  wastageCost: number;
  marginCost: number;
  meters: number;
  totalCost: number;
}

export const useExtraPavingQuote = (quoteId?: string) => {
  const [pavingSelections, setPavingSelections] = useState<PavingSelection[]>([]);
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { extraPavingCosts } = useExtraPavingCosts();
  const { updateQuoteData } = useQuoteContext();

  // Fetch existing selections for this quote
  useEffect(() => {
    if (!quoteId) return;

    const fetchSelections = async () => {
      setIsLoading(true);
      try {
        // First get the selections
        const { data: selectionsData, error: selectionsError } = await supabase
          .from("quote_extra_pavings")
          .select("*")
          .eq("quote_id", quoteId);

        if (selectionsError) {
          throw selectionsError;
        }

        if (!selectionsData?.length) {
          setPavingSelections([]);
          setIsLoading(false);
          return;
        }

        // Then get the extra paving cost details for each selection
        const selectionPromises = selectionsData.map(async (selection) => {
          const { data: pavingData, error: pavingError } = await supabase
            .from("extra_paving_costs")
            .select("*")
            .eq("id", selection.paving_id)
            .single();

          if (pavingError) {
            console.error("Error fetching paving details:", pavingError);
            return null;
          }

          return {
            id: selection.id,
            quoteId: selection.quote_id,
            pavingId: selection.paving_id,
            pavingCategory: pavingData.category,
            paverCost: pavingData.paver_cost,
            wastageCost: pavingData.wastage_cost,
            marginCost: pavingData.margin_cost,
            meters: selection.meters,
            totalCost: selection.total_cost
          };
        });

        const resolvedSelections = await Promise.all(selectionPromises);
        const validSelections = resolvedSelections.filter(Boolean) as PavingSelection[];
        
        setPavingSelections(validSelections);
        
        // Calculate total cost
        const total = validSelections.reduce((sum, selection) => sum + (selection.totalCost || 0), 0);
        setTotalCost(total);
        
      } catch (error) {
        console.error("Error fetching extra paving selections:", error);
        toast.error("Failed to load extra paving data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSelections();
  }, [quoteId]);

  // Calculate the cost for a single selection, including material and labor costs
  const calculateSelectionCost = (selection: PavingSelection): number => {
    // Material costs
    const materialCostPerMeter = selection.paverCost + selection.wastageCost + selection.marginCost;
    
    // Fixed labor costs
    const laborCostPerMeter = 100; // Fixed labor cost of $100
    const laborMarginPerMeter = 30;  // Fixed labor margin of $30
    
    // Total cost per meter
    const totalCostPerMeter = materialCostPerMeter + laborCostPerMeter + laborMarginPerMeter;
    
    // Total cost for all meters
    return totalCostPerMeter * selection.meters;
  };

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
    setPavingSelections(prev => [...prev, newSelection]);
    updateTotalCost([...pavingSelections, newSelection]);
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
    const total = selections.reduce((sum, selection) => sum + selection.totalCost, 0);
    setTotalCost(total);
  };

  // Calculate total margin
  const calculateTotalMargin = () => {
    return pavingSelections.reduce((sum, selection) => {
      const materialMargin = selection.marginCost * selection.meters;
      const laborMargin = 30 * selection.meters; // Fixed labor margin of $30 per meter
      return sum + materialMargin + laborMargin;
    }, 0);
  };

  // Save all selections to the database
  const saveSelections = async () => {
    if (!quoteId) {
      toast.error("No quote ID available. Cannot save paving selections.");
      return;
    }

    try {
      // First, delete any existing selections
      const { error: deleteError } = await supabase
        .from("quote_extra_pavings")
        .delete()
        .eq("quote_id", quoteId);

      if (deleteError) throw deleteError;

      // Insert new selections if there are any
      if (pavingSelections.length > 0) {
        const selectionsToInsert = pavingSelections.map(selection => ({
          quote_id: quoteId,
          paving_id: selection.pavingId,
          meters: selection.meters,
          total_cost: selection.totalCost
        }));

        const { error: insertError } = await supabase
          .from("quote_extra_pavings")
          .insert(selectionsToInsert);

        if (insertError) throw insertError;
      }

      // Update the total cost in the quote
      const { error: updateError } = await supabase
        .from("quotes")
        .update({ extra_paving_cost: totalCost })
        .eq("id", quoteId);

      if (updateError) throw updateError;

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
    totalMargin: calculateTotalMargin(),
    isLoading,
    addSelection,
    updateSelectionMeters,
    removeSelection,
    saveSelections
  };
};
