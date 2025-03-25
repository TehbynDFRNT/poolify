
import { useState } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { saveRequirements } from "../services/siteRequirementsService";
import { CustomSiteRequirement } from "../types";
import { toast } from "sonner";

interface UseFormSubmissionParams {
  onNext: () => void;
}

export const useFormSubmission = ({ onNext }: UseFormSubmissionParams) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveRequirements = async (
    continueToNext: boolean,
    {
      craneId,
      trafficControlId,
      bobcatId,
      customRequirements,
      microDigRequired,
      microDigPrice,
      microDigNotes
    }: {
      craneId: string | undefined;
      trafficControlId: string | undefined;
      bobcatId: string | undefined;
      customRequirements: CustomSiteRequirement[];
      microDigRequired: boolean;
      microDigPrice: number;
      microDigNotes: string;
    }
  ) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    const { success, totalCost } = await saveRequirements({
      quoteId: quoteData.id,
      craneId: craneId || null,
      trafficControlId: trafficControlId || 'none',
      bobcatId: bobcatId,
      customRequirements,
      microDigRequired,
      microDigPrice,
      microDigNotes
    });
    
    if (success) {
      // Update context with the latest values
      updateQuoteData({
        site_requirements_cost: totalCost,
        micro_dig_required: microDigRequired,
        micro_dig_price: microDigPrice,
        micro_dig_notes: microDigNotes
      });
      
      setIsSubmitting(false);
      
      if (continueToNext) onNext();
    } else {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSaveRequirements
  };
};
