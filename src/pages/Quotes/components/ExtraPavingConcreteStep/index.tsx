
import { useState } from "react";
import { useQuoteContext } from "../../context/QuoteContext";
import { FormHeader } from "../SiteRequirementsStep/components/FormHeader";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { NoPoolWarning } from "../SiteRequirementsStep/components/NoPoolWarning";
import { FormActions } from "../SiteRequirementsStep/components/FormActions";
import { PageSummary } from "./components/PageSummary";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep = ({ onNext, onPrevious }: ExtraPavingConcreteStepProps) => {
  const { quoteData, refreshQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveOnly = async () => {
    setIsSubmitting(true);
    try {
      // Auto-save is handled in the child components
      await refreshQuoteData();
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error("Error saving extra paving and concrete data:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndContinue = async () => {
    setIsSubmitting(true);
    try {
      // Auto-save is handled in the child components
      await refreshQuoteData();
      toast.success("Changes saved successfully");
      onNext();
    } catch (error) {
      console.error("Error saving extra paving and concrete data:", error);
      toast.error("Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader>
        Extra Paving & Concrete
      </FormHeader>
      
      {!quoteData.pool_id && <NoPoolWarning />}
      
      {/* Paving on Existing Concrete */}
      <PavingOnExistingConcrete />
      
      {/* Summary */}
      <PageSummary />
      
      {/* Form Actions at the bottom */}
      <FormActions
        onPrevious={onPrevious}
        onSaveOnly={handleSaveOnly}
        onSaveAndContinue={handleSaveAndContinue}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
