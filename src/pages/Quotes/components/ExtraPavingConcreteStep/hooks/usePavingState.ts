
import { useState, useEffect } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";

export const usePavingState = () => {
  const { quoteData } = useQuoteContext();
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data from quote if we're editing
  useEffect(() => {
    if (quoteData.selected_paving_id) {
      setSelectedPavingId(quoteData.selected_paving_id);
    }
    if (quoteData.selected_paving_meters) {
      setMeters(quoteData.selected_paving_meters);
    }
  }, [quoteData]);

  const handleSelectedPavingChange = (id: string) => {
    setSelectedPavingId(id);
  };

  const handleMetersChange = (value: number) => {
    setMeters(value);
  };

  return {
    selectedPavingId,
    meters,
    isSubmitting,
    setIsSubmitting,
    handleSelectedPavingChange,
    handleMetersChange
  };
};
