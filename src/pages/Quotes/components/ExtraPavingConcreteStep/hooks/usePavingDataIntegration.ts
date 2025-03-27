
import { useState } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useConcreteCostCalculator } from "./useConcreteCostCalculator";
import { usePageSaveState } from "./usePageSaveState";
import { usePavingState } from "./usePavingState";
import { useSavePavingData } from "./useSavePavingData";
import { useQuoteContext } from "../../../context/QuoteContext";
import { toast } from "sonner";

export const usePavingDataIntegration = (onNext?: () => void) => {
  const { quoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  const { hasUnsavedChanges, markAsChanged, markAsSaved } = usePageSaveState();
  
  const {
    selectedPavingId,
    meters,
    isSubmitting,
    setIsSubmitting,
    handleSelectedPavingChange: onSelectedPavingChange,
    handleMetersChange: onMetersChange
  } = usePavingState();
  
  const {
    pavingOnExistingConcreteRef,
    saveExtraPavingData,
    saveExistingConcretePavingData,
    removeExtraPaving,
    refreshQuoteData
  } = useSavePavingData();

  // Use the custom hook for cost calculations
  const { 
    perMeterCost, 
    totalCost, 
    materialCost, 
    labourCost,
    marginCost,
    pavingDetails,
    concreteDetails,
    labourDetails 
  } = useConcreteCostCalculator(
    selectedPavingId, 
    meters, 
    extraPavingCosts, 
    concreteCosts, 
    concreteLabourCosts
  );

  // Mark changes when inputs change
  const handleSelectedPavingChange = (id: string) => {
    onSelectedPavingChange(id);
    markAsChanged();
  };

  const handleMetersChange = (value: number) => {
    onMetersChange(value);
    markAsChanged();
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      let isSaveSuccessful = true;
      
      // First save the main paving data
      if (selectedPavingId && meters > 0) {
        const savePavingResult = await saveExtraPavingData(
          selectedPavingId, 
          meters, 
          {
            perMeterCost,
            materialCost,
            labourCost,
            marginCost,
            totalCost,
            pavingDetails,
            concreteDetails,
            labourDetails
          }
        );
        
        if (!savePavingResult) {
          isSaveSuccessful = false;
        }
      }

      // Then save the paving on existing concrete data
      const saveExistingResult = await saveExistingConcretePavingData();
      if (!saveExistingResult) {
        isSaveSuccessful = false;
      }
      
      // Refresh the quote data to ensure we have the latest state
      await refreshQuoteData();
      
      if (isSaveSuccessful) {
        toast.success("All paving & concrete data saved successfully");
        markAsSaved();
      } else {
        toast.error("Some data could not be saved. Please check and try again.");
      }
      
      return isSaveSuccessful;
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred while saving");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndContinue = async () => {
    try {
      const saveResult = await handleSave();
      // Only navigate if save was successful and onNext is provided
      if (saveResult && onNext) {
        // Delay the navigation slightly to ensure state is updated
        setTimeout(() => {
          onNext();
        }, 300);
      }
    } catch (error) {
      console.error("Error in save and continue:", error);
    }
  };

  const handleRemoveExtraPaving = async () => {
    setIsSubmitting(true);
    try {
      const result = await removeExtraPaving();
      if (result) {
        // Update local state after successful removal
        onSelectedPavingChange("");
        onMetersChange(0);
        await refreshQuoteData();
        markAsSaved();
        return true;
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingPaving || isLoadingConcrete || isLoadingLabour;
  const hasCostData = selectedPavingId && meters > 0;

  return {
    quoteData,
    extraPavingCosts,
    isLoading,
    selectedPavingId,
    meters,
    hasCostData,
    isSubmitting,
    perMeterCost,
    materialCost,
    labourCost,
    marginCost,
    totalCost,
    pavingDetails,
    concreteDetails,
    labourDetails,
    hasUnsavedChanges,
    pavingOnExistingConcreteRef,
    handleSelectedPavingChange,
    handleMetersChange,
    handleSave,
    handleSaveAndContinue,
    handleRemoveExtraPaving,
    markAsChanged
  };
};
