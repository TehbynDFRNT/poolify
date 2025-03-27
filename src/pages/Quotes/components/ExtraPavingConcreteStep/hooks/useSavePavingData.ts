import { useState } from "react";
import { Quote } from "@/types/quote";
import { supabase } from "@/integrations/supabase/client";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

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
      // First, update the total extra paving cost in the quote
      const totalExtraPavingCost = calculateTotalExtraPavingCost(totalCost);
      
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_paving_cost: totalExtraPavingCost,
          selected_paving_id: selectedPavingId,
          selected_paving_meters: meters,
          selected_paving_cost: totalCost,
          selected_paving_margin: marginCost,
        })
        .eq("id", quoteData.id);

      if (error) {
        throw error;
      }

      await refreshQuoteData();
    } catch (error) {
      console.error("Error saving extra paving data:", error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate the total extra paving cost (including all concrete components)
  const calculateTotalExtraPavingCost = (extraPavingCost: number): number => {
    // Start with the main paving cost
    let totalCost = extraPavingCost;

    // Add existing concrete paving cost
    if (quoteData.existing_concrete_paving_cost) {
      totalCost += quoteData.existing_concrete_paving_cost;
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
    
    // Add extra concreting cost
    if (quoteData.extra_concreting_cost) {
      totalCost += quoteData.extra_concreting_cost;
    }

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

      if (quoteData.concrete_pump_required && quoteData.concrete_pump_price) {
        newTotal += quoteData.concrete_pump_price;
      }

      if (quoteData.concrete_cuts_cost) {
        newTotal += quoteData.concrete_cuts_cost;
      }

      if (quoteData.under_fence_strips_cost) {
        newTotal += quoteData.under_fence_strips_cost;
      }
      
      if (quoteData.extra_concreting_cost) {
        newTotal += quoteData.extra_concreting_cost;
      }

      // Update the quote with removed extra paving
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_paving_cost: newTotal,
          selected_paving_id: null,
          selected_paving_meters: 0,
          selected_paving_cost: 0,
          selected_paving_margin: 0,
        })
        .eq("id", quoteData.id);

      if (error) {
        throw error;
      }

      // Reset local state
      resetPavingState();
      updateQuoteData({
        selected_paving_id: "",
        selected_paving_meters: 0,
        selected_paving_cost: 0,
        selected_paving_margin: 0,
        extra_paving_cost: newTotal,
      });

      await refreshQuoteData();
    } catch (error) {
      console.error("Error removing extra paving:", error);
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
