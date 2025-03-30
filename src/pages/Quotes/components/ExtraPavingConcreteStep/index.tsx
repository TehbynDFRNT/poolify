
import { useState } from "react";
import { useQuoteContext } from "../../context/QuoteContext";
import { ExtraPavingOnConcrete } from "../ExtraPavingStep/components/ExtraPavingOnConcrete";
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
    try {
      setIsSubmitting(true);
      // We don't need additional save logic here as the component handles its own saving
      toast.success("Extra paving on concrete data saved");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      setIsSubmitting(true);
      // We don't need additional save logic here as the component handles its own saving
      toast.success("Extra paving on concrete data saved");
      onNext();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Extra Paving & Concrete</h2>
      <p className="text-gray-500 mb-6">Calculate additional paving and concrete costs</p>
      
      {!quoteData.pool_id && (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
          <p className="text-amber-800">
            No pool has been selected for this quote. Please select a pool first.
          </p>
        </div>
      )}

      <ExtraPavingOnConcrete />
      
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={onPrevious}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <div className="space-x-3">
          <button
            type="button"
            onClick={handleSaveOnly}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            {isSubmitting ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </div>
      </div>
    </div>
  );
};
