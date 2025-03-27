
import { useRef } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useSavePavingData } from "./useSavePavingData";
import { usePageSaveState } from "./usePageSaveState";
import { usePavingState } from "./usePavingState";
import { usePavingDataCalculator } from "./usePavingDataCalculator";
import { toast } from "sonner";

export const useExtraPavingData = (onNext: () => void) => {
  // Hooks for context
  const { quoteData, refreshQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isPavingLoading } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLabourLoading } = useConcreteLabourCosts();
  const { concreteCosts, isLoading: isConcreteLoading } = useConcreteCosts();
  
  // Page save state management
  const {
    hasUnsavedChanges,
    markAsChanged,
    markAsSaved
  } = usePageSaveState();
  
  // Paving state management
  const {
    selectedPavingId,
    meters,
    setSelectedPavingId,
    setMeters
  } = usePavingState(quoteData);
  
  // Cost calculation
  const {
    perMeterCost,
    materialCost,
    labourCost,
    marginCost,
    totalCost,
    pavingDetails,
    concreteDetails,
    labourDetails,
    hasCostData,
    isLoading: isCalculationLoading,
    resetCostData
  } = usePavingDataCalculator(selectedPavingId, meters);

  // Function to reset paving state
  const resetPavingState = () => {
    setSelectedPavingId("");
    setMeters(0);
    resetCostData();
  };
  
  // Save functionality
  const {
    isSubmitting,
    handleSaveData,
    handleRemoveExtraPaving
  } = useSavePavingData(quoteData, resetPavingState);
  
  // Refs for additional components
  const pavingOnExistingConcreteRef = useRef<HTMLDivElement>(null);
  const extraConcretingRef = useRef<HTMLDivElement>(null);
  
  // Handle paving selection change
  const handleSelectedPavingChange = (pavingId: string) => {
    setSelectedPavingId(pavingId);
    markAsChanged();
  };
  
  // Handle meters change
  const handleMetersChange = (value: number) => {
    setMeters(value);
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
  
  const isLoading = isPavingLoading || isLabourLoading || isConcreteLoading || isCalculationLoading;
  
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
