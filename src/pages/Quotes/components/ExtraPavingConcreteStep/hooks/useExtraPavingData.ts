
import { useState, useEffect, useRef } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { usePavingState } from "./usePavingState";
import { useSavePavingData } from "./useSavePavingData";
import { usePageSaveState } from "./usePageSaveState";
import { Quote } from "@/types/quote";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { toast } from "sonner";

export const useExtraPavingData = (onNext: () => void) => {
  // Hooks for managing data
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isPavingLoading } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLabourLoading } = useConcreteLabourCosts();
  const { concreteCosts, isLoading: isConcreteLoading } = useConcreteCosts();
  
  // State for paving selection
  const {
    selectedPavingId,
    meters,
    hasCostData,
    perMeterCost,
    materialCost,
    labourCost,
    marginCost,
    totalCost,
    pavingDetails,
    concreteDetails,
    labourDetails,
    setSelectedPavingId,
    setMeters,
    resetPavingState,
    calculateCosts
  } = usePavingState(extraPavingCosts, concreteLabourCosts, concreteCosts);
  
  // Save functionality
  const {
    isSubmitting,
    handleSaveData,
    handleRemoveExtraPaving
  } = useSavePavingData(quoteData, resetPavingState);
  
  // Page save state management
  const {
    hasUnsavedChanges,
    markAsChanged,
    markAsSaved
  } = usePageSaveState();
  
  // Refs for additional components
  const pavingOnExistingConcreteRef = useRef<HTMLDivElement>(null);
  const extraConcretingRef = useRef<HTMLDivElement>(null);
  
  // Initialize with existing data
  useEffect(() => {
    if (quoteData.selected_paving_id) {
      setSelectedPavingId(quoteData.selected_paving_id);
      setMeters(quoteData.selected_paving_meters || 0);
    }
  }, [quoteData.selected_paving_id, quoteData.selected_paving_meters, setSelectedPavingId, setMeters]);
  
  // Update costs calculation when the paving selection or meters change
  useEffect(() => {
    if (selectedPavingId && meters > 0) {
      calculateCosts(selectedPavingId, meters);
    }
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts, concreteCosts, calculateCosts]);
  
  // Handle paving selection change
  const handleSelectedPavingChange = (pavingId: string) => {
    setSelectedPavingId(pavingId);
    updateQuoteData({ selected_paving_id: pavingId });
    markAsChanged();
  };
  
  // Handle meters change
  const handleMetersChange = (value: number) => {
    setMeters(value);
    updateQuoteData({ selected_paving_meters: value });
    markAsChanged();
  };
  
  // Handle save
  const handleSave = async () => {
    try {
      await handleSaveData(
        selectedPavingId,
        meters,
        totalCost || 0,
        marginCost || 0
      );
      toast.success("Extra paving data saved successfully");
      markAsSaved();
    } catch (error) {
      console.error("Error saving extra paving data:", error);
      toast.error("Failed to save extra paving data");
    }
  };
  
  // Handle save and continue
  const handleSaveAndContinue = async () => {
    try {
      await handleSaveData(
        selectedPavingId,
        meters,
        totalCost || 0,
        marginCost || 0
      );
      toast.success("Extra paving data saved successfully");
      markAsSaved();
      onNext();
    } catch (error) {
      console.error("Error saving extra paving data:", error);
      toast.error("Failed to save extra paving data");
    }
  };
  
  const isLoading = isPavingLoading || isLabourLoading || isConcreteLoading;
  
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
    extraConcretingRef,
    handleSelectedPavingChange,
    handleMetersChange,
    handleSave,
    handleSaveAndContinue,
    handleRemoveExtraPaving,
    markAsChanged
  };
};
