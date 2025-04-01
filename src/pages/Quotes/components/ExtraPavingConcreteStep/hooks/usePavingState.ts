
import { useState, useEffect, useCallback } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";

export const usePavingState = (quoteData: any) => {
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { extraPavingCosts } = useExtraPavingCosts();

  // Load saved paving data when the component mounts or when quoteData changes
  useEffect(() => {
    if (quoteData && quoteData.selected_paving_id) {
      console.log("Loading saved paving data from quote:", quoteData.selected_paving_id, quoteData.selected_paving_meters);
      setSelectedPavingId(quoteData.selected_paving_id);
      
      // Ensure meters is a number
      const metersValue = Number(quoteData.selected_paving_meters) || 0;
      setMeters(metersValue);
    } else {
      console.log("No saved paving data found in quote");
      // Reset state if no data is available
      setSelectedPavingId("");
      setMeters(0);
    }
  }, [quoteData]);

  // Handle paving type selection change
  const handleSelectedPavingChange = useCallback((id: string) => {
    setSelectedPavingId(id);
  }, []);

  // Handle meters change
  const handleMetersChange = useCallback((value: number) => {
    setMeters(value);
  }, []);

  // Helper to check if we have existing data
  const hasExistingData = Boolean(quoteData?.selected_paving_id && quoteData?.selected_paving_meters > 0);

  return {
    selectedPavingId,
    meters,
    isSubmitting,
    setIsSubmitting,
    handleSelectedPavingChange,
    handleMetersChange,
    hasExistingData
  };
};
