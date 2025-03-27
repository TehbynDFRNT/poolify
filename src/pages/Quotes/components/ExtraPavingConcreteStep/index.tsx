
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
  const { quoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveOnly = async () => {
    setIsSubmitting(true);
    try {
      // Save logic can be triggered here, but actual saving happens in PavingOnExistingConcrete component
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
      // Save logic can be triggered here, but actual saving happens in PavingOnExistingConcrete component
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
        Add paving on existing concrete
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
