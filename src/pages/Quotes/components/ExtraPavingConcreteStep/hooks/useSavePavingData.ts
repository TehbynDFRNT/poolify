import { useState } from "react";
import { Quote } from "@/types/quote";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";

export const useSavePavingData = (
  quoteData: Partial<Quote>,
  resetPavingState: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshQuoteData, updateQuoteData } = useQuoteContext();

  // Save all paving data to the database
  const handleSaveData = async (
    selectedPavingId: string,
    meters: number,
    totalCost: number,
    marginCost: number
  ) => {
    if (!quoteData.id) {
      throw new Error("Quote ID is required");
    }

    setIsSubmitting(true);

    try {
      // Calculate the total extra paving cost including all concrete components
      const totalExtraPavingCost = calculateTotalExtraPavingCost(totalCost);
      
      // Create an update object with all necessary fields
      // Make sure we only include fields that exist in the database schema
      const updateData: Partial<Quote> = {
        // Main extra paving section - using the fields that exist in the database
        selected_paving_id: selectedPavingId || null,
        selected_paving_meters: meters || 0,
        // Don't include selected_paving_cost or selected_paving_margin as they don't exist in the schema
        
        // Set the combined total cost
        extra_paving_cost: totalExtraPavingCost,
        
        // Update the quote's total cost by adding site_requirements_cost + extra_paving_cost + optional_addons_cost
        total_cost: (quoteData.site_requirements_cost || 0) + 
                   totalExtraPavingCost + 
                   (quoteData.optional_addons_cost || 0)
      };

      // Update the database
      const { error } = await supabase
        .from("quotes")
        .update(updateData)
        .eq("id", quoteData.id);

      if (error) {
        console.error("Error saving paving data:", error);
        throw error;
      }

      // Update local context with same data
      updateQuoteData(updateData);
      
      // Refresh quote data to get the very latest
      await refreshQuoteData();
      
      return true;
    } catch (error) {
      console.error("Error saving extra paving data:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the total extra paving cost (including all concrete components)
  const calculateTotalExtraPavingCost = (mainPavingCost: number): number => {
    // Start with the main paving cost
    let totalCost = mainPavingCost || 0;

    // Add existing concrete paving cost
    if (quoteData.existing_concrete_paving_cost) {
      totalCost += quoteData.existing_concrete_paving_cost;
    }

    // Add extra concreting cost
    if (quoteData.extra_concreting_cost) {
      totalCost += quoteData.extra_concreting_cost;
    }

    // Add concrete pump cost
    if (quoteData.concrete_pump_required && quoteData.concrete_pump_price) {
      totalCost += quoteData.concrete_pump_price;
    }

    // Add concrete cuts cost
    if (quoteData.concrete_cuts_cost) {
      totalCost += quoteData.concrete_cuts_cost;
    }

    // Add under fence strips cost
    if (quoteData.under_fence_strips_cost) {
      totalCost += quoteData.under_fence_strips_cost;
    }

    console.log("Calculated total extra paving cost:", totalCost);
    
    return totalCost;
  };

  // Remove extra paving from quote
  const handleRemoveExtraPaving = async () => {
    if (!quoteData.id) {
      throw new Error("Quote ID is required");
    }

    setIsSubmitting(true);

    try {
      // Calculate new total without the main paving cost
      let newTotal = 0;

      // Keep other concrete costs
      if (quoteData.existing_concrete_paving_cost) {
        newTotal += quoteData.existing_concrete_paving_cost;
      }

      if (quoteData.extra_concreting_cost) {
        newTotal += quoteData.extra_concreting_cost;
      }

      if (quoteData.concrete_pump_required && quoteData.concrete_pump_price) {
        newTotal += quoteData.concrete_pump_price;
      }

      if (quoteData.concrete_cuts_cost) {
        newTotal += quoteData.concrete_cuts_cost;
      }

      if (quoteData.under_fence_strips_cost) {
        newTotal += quoteData.under_fence_strips_cost;
      }

      const updateData: Partial<Quote> = {
        extra_paving_cost: newTotal,
        selected_paving_id: null,
        selected_paving_meters: 0,
        // Removed selected_paving_cost and selected_paving_margin as they don't exist in the schema
        total_cost: (quoteData.site_requirements_cost || 0) + 
                   newTotal + 
                   (quoteData.optional_addons_cost || 0)
      };

      // Update the database
      const { error } = await supabase
        .from("quotes")
        .update(updateData)
        .eq("id", quoteData.id);

      if (error) {
        console.error("Error removing extra paving:", error);
        throw error;
      }

      // Reset local state
      resetPavingState();
      
      // Update local context with same data
      updateQuoteData(updateData);
      
      // Refresh quote data to get the very latest
      await refreshQuoteData();
      
      toast.success("Extra paving removed successfully");
      
      return true;
    } catch (error) {
      console.error("Error removing extra paving:", error);
      toast.error("Failed to remove extra paving");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSaveData,
    handleRemoveExtraPaving,
  };
};
