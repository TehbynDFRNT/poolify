
import { useState, useEffect } from "react";
import { Quote } from "@/types/quote";

export const usePavingState = (quoteData: Partial<Quote>) => {
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data from quote if we're editing
  useEffect(() => {
    if (quoteData.selected_paving_id) {
      setSelectedPavingId(quoteData.selected_paving_id);
    }
    
    // Ensure meters is always a number
    if (quoteData.selected_paving_meters !== undefined) {
      const selectedMeters = quoteData.selected_paving_meters;
      setMeters(typeof selectedMeters === 'number' ? selectedMeters : Number(selectedMeters));
    }
  }, [quoteData]);

  // Handler functions for paving selection and meters change
  const handleSelectedPavingChange = (pavingId: string) => {
    setSelectedPavingId(pavingId);
  };

  const handleMetersChange = (value: number) => {
    setMeters(value);
  };

  return {
    selectedPavingId,
    meters,
    isSubmitting,
    setSelectedPavingId,
    setMeters,
    setIsSubmitting,
    handleSelectedPavingChange,
    handleMetersChange
  };
};
