
import { useState } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { 
  savePavingSelections, 
  saveConcretePumpAndCuts 
} from "../services/pavingService";
import { ConcreteCutSelection, PavingSelection } from "../types";
import { toast } from "sonner";

interface UseFormSubmissionParams {
  onNext: () => void;
}

export const useFormSubmission = ({ onNext }: UseFormSubmissionParams) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveExtraPaving = async (
    continueToNext: boolean,
    {
      pavingSelections,
      pavingTotalCost,
      isPumpRequired,
      pumpPrice,
      concreteCuts,
      concreteCutsCost
    }: {
      pavingSelections: PavingSelection[];
      pavingTotalCost: number;
      isPumpRequired: boolean;
      pumpPrice: number;
      concreteCuts: ConcreteCutSelection[];
      concreteCutsCost: number;
    }
  ) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // First save the paving selections
      await savePavingSelections(quoteData.id, pavingSelections, pavingTotalCost);
      
      // Then save the concrete pump and cuts selections
      await saveConcretePumpAndCuts(
        quoteData.id, 
        isPumpRequired, 
        pumpPrice, 
        concreteCuts, 
        concreteCutsCost
      );
      
      // Calculate total extra paving cost including concrete cuts and pump
      const totalExtraPavingCost = pavingTotalCost + 
        (isPumpRequired ? pumpPrice : 0) + 
        concreteCutsCost;
      
      // Update context with the latest values
      updateQuoteData({
        extra_paving_cost: totalExtraPavingCost,
        concrete_pump_required: isPumpRequired,
        concrete_pump_price: pumpPrice,
        concrete_cuts: JSON.stringify(concreteCuts),
        concrete_cuts_cost: concreteCutsCost
      });
      
      toast.success("Extra paving selections saved");
      
      if (continueToNext) {
        onNext();
      }
    } catch (error) {
      console.error("Error saving extra paving selections:", error);
      toast.error("Failed to save extra paving selections");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSaveExtraPaving
  };
};
