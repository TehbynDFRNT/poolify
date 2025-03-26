
import { useState } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { savePavingSelections, saveConcretePumpAndCuts } from "../services/pavingService";
import { toast } from "sonner";
import { PavingSelection, ConcreteCutSelection, UnderFenceConcreteStripSelection } from "../types";

interface FormSubmissionProps {
  onNext: () => void;
}

interface SaveData {
  pavingSelections: PavingSelection[];
  pavingTotalCost: number;
  isPumpRequired: boolean;
  pumpPrice: number;
  concreteCuts: ConcreteCutSelection[];
  concreteCutsCost: number;
  underFenceStrips: UnderFenceConcreteStripSelection[];
  underFenceStripsCost: number;
}

export const useFormSubmission = ({ onNext }: FormSubmissionProps) => {
  const { quoteData, refreshQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveExtraPaving = async (continueToNext: boolean, data: SaveData) => {
    try {
      setIsSubmitting(true);
      
      // Save paving selections
      await savePavingSelections(
        quoteData.id, 
        data.pavingSelections, 
        data.pavingTotalCost
      );
      
      // Save concrete pump and cuts
      await saveConcretePumpAndCuts(
        quoteData.id,
        data.isPumpRequired,
        data.pumpPrice,
        data.concreteCuts,
        data.concreteCutsCost,
        data.underFenceStrips,
        data.underFenceStripsCost
      );
      
      // Refresh quote data to get the updated values
      await refreshQuoteData();
      
      toast.success("Extra paving requirements saved successfully");
      
      if (continueToNext) {
        onNext();
      }
    } catch (error) {
      console.error("Error saving extra paving requirements:", error);
      toast.error("Failed to save extra paving requirements");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return {
    isSubmitting,
    handleSaveExtraPaving
  };
};
