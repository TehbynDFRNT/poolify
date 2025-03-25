
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { FormHeader } from "../SiteRequirementsStep/components/FormHeader";
import { ExtraPavingSelector } from "./components/ExtraPavingSelector";
import { useExtraPavingQuote } from "./hooks/useExtraPavingQuote";
import { NoPoolWarning } from "../SiteRequirementsStep/components/NoPoolWarning";
import { toast } from "sonner";

interface ExtraPavingStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingStep = ({ onNext, onPrevious }: ExtraPavingStepProps) => {
  const { quoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    pavingSelections, 
    addSelection, 
    updateSelectionMeters, 
    removeSelection,
    totalCost,
    saveSelections
  } = useExtraPavingQuote(quoteData.id);

  const handleSaveAndContinue = async () => {
    setIsSubmitting(true);
    try {
      await saveSelections();
      toast.success("Extra paving selections saved");
      onNext();
    } catch (error) {
      toast.error("Failed to save extra paving selections");
      console.error("Error saving extra paving selections:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader>
        Add additional paving to your quote
      </FormHeader>
      
      {!quoteData.pool_id && <NoPoolWarning />}

      <ExtraPavingSelector
        quoteId={quoteData.id}
        selections={pavingSelections}
        onAdd={addSelection}
        onUpdate={updateSelectionMeters}
        onRemove={removeSelection}
      />

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        
        <div className="space-x-2">
          <Button 
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};
