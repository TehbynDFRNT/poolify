
import { useState, useEffect } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";

export const usePavingState = () => {
  const { quoteData } = useQuoteContext();
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data from quote if we're editing
  useEffect(() => {
    if (quoteData.concrete_cuts) {
      try {
        const savedData = JSON.parse(quoteData.concrete_cuts);
        if (savedData && savedData.paving_id) {
          setSelectedPavingId(savedData.paving_id);
          setMeters(savedData.meters || 0);
        }
      } catch (err) {
        console.error("Failed to parse saved paving data:", err);
      }
    }
  }, [quoteData.concrete_cuts]);

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
