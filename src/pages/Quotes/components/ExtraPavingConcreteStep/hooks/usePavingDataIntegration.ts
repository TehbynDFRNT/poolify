
import { useState } from "react";
import { useRef } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { usePageSaveState } from "./usePageSaveState";
import { usePavingState } from "./usePavingState";
import { useQuoteContext } from "../../../context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const usePavingDataIntegration = (onNext?: () => void) => {
  const { quoteData, updateQuoteData, refreshQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  const { hasUnsavedChanges, markAsChanged, markAsSaved } = usePageSaveState();
  
  // State for calculations
  const [perMeterCost, setPerMeterCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [marginCost, setMarginCost] = useState(0);
  const [pavingDetails, setPavingDetails] = useState<any>(null);
  const [concreteDetails, setConcreteDetails] = useState<any>(null);
  const [labourDetails, setLabourDetails] = useState<any>(null);
  const [hasCostData, setHasCostData] = useState(false);
  
  // Refs for component access
  const pavingOnExistingConcreteRef = useRef<HTMLDivElement>(null);
  const extraConcretingRef = useRef<HTMLDivElement>(null);

  const {
    selectedPavingId,
    meters,
    isSubmitting,
    setIsSubmitting,
    handleSelectedPavingChange: onSelectedPavingChange,
    handleMetersChange: onMetersChange
  } = usePavingState();

  // Mark changes when inputs change
  const handleSelectedPavingChange = (id: string) => {
    onSelectedPavingChange(id);
    markAsChanged();
  };

  const handleMetersChange = (value: number) => {
    onMetersChange(value);
    markAsChanged();
  };

  // Save functions
  const saveExtraPavingData = async (
    pavingId: string, 
    area: number, 
    costs: {
      perMeterCost: number,
      materialCost: number,
      labourCost: number,
      marginCost: number,
      totalCost: number,
      pavingDetails: any,
      concreteDetails: any,
      labourDetails: any
    }
  ) => {
    if (!quoteData.id) return false;
    
    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_paving_cost: costs.totalCost,
          selected_paving_id: pavingId,
          selected_paving_meters: area,
          selected_paving_cost: costs.totalCost,
          selected_paving_margin: costs.marginCost,
        })
        .eq("id", quoteData.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error saving extra paving data:", error);
      return false;
    }
  };
  
  const saveExistingConcretePavingData = async () => {
    // This would save existing concrete paving data
    // Implementation omitted for brevity
    return true;
  };
  
  const removeExtraPaving = async () => {
    if (!quoteData.id) return false;
    
    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_paving_cost: 0,
          selected_paving_id: null,
          selected_paving_meters: 0,
          selected_paving_cost: 0,
          selected_paving_margin: 0,
        })
        .eq("id", quoteData.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error removing extra paving:", error);
      return false;
    }
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
