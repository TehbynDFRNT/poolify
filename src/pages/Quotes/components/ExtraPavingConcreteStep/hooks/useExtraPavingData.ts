import { useState, useEffect, useCallback, useRef } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { usePageSaveState } from "./usePageSaveState";

export const useExtraPavingData = (onNext?: () => void) => {
  const { quoteData, refreshQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  const { hasUnsavedChanges, markAsChanged, markAsSaved } = usePageSaveState();
  
  // State for paving selection and meters
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  // State for calculations
  const [perMeterCost, setPerMeterCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [materialCost, setMaterialCost] = useState<number>(0);
  const [labourCost, setLabourCost] = useState<number>(0);
  const [marginCost, setMarginCost] = useState<number>(0);
  const [pavingDetails, setPavingDetails] = useState<any>(null);
  const [concreteDetails, setConcreteDetails] = useState<any>(null);
  const [labourDetails, setLabourDetails] = useState<any>(null);
  const [hasCostData, setHasCostData] = useState<boolean>(false);
  const [hasExistingData, setHasExistingData] = useState<boolean>(false);
  
  // Refs for component access
  const pavingOnExistingConcreteRef = useRef<HTMLDivElement>(null);
  const extraConcretingRef = useRef<HTMLDivElement>(null);

  // Load saved paving data when component mounts
  useEffect(() => {
    // Early return if no quote data yet
    if (!quoteData.id) return;
    
    // Check if there's saved paving data (selected_paving_id and selected_paving_meters)
    if (quoteData.selected_paving_id && quoteData.selected_paving_meters) {
      setSelectedPavingId(quoteData.selected_paving_id);
      setMeters(quoteData.selected_paving_meters);
      setHasExistingData(true);
      setHasCostData(true);
    }
  }, [quoteData]);

  // Calculate costs when inputs change
  useEffect(() => {
    if (!selectedPavingId || meters <= 0 || !extraPavingCosts || !concreteLabourCosts) {
      setHasCostData(false);
      return;
    }
    
    const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
    if (!selectedPaving) {
      setHasCostData(false);
      return;
    }
    
    // Calculate paving material cost per meter
    const paverCost = selectedPaving.paver_cost || 0;
    const wastageCost = selectedPaving.wastage_cost || 0;
    const marginPavingCost = selectedPaving.margin_cost || 0;
    const perMeterPavingCost = paverCost + wastageCost + marginPavingCost;
    
    // Calculate total paving material cost
    const totalPavingCost = perMeterPavingCost * meters;
    
    // Calculate labour cost
    let totalLabourCost = 0;
    let labourMarginCost = 0;
    
    if (concreteLabourCosts) {
      concreteLabourCosts.forEach(labour => {
        totalLabourCost += (labour.cost || 0) * meters;
        labourMarginCost += (labour.margin || 0) * meters;
      });
    }
    
    // Calculate total margin (from paving and labour)
    const totalMargin = (marginPavingCost * meters) + labourMarginCost;
    
    // Calculate total cost
    const calculatedTotalCost = totalPavingCost + totalLabourCost;
    
    // Store additional details
    setPavingDetails({
      category: selectedPaving.category,
      paverCost,
      wastageCost,
      marginCost: marginPavingCost
    });
    
    setConcreteDetails(concreteCosts?.[0] || null);
    
    setLabourDetails({
      baseCost: totalLabourCost - labourMarginCost,
      marginCost: labourMarginCost
    });
    
    // Update state
    setPerMeterCost(perMeterPavingCost + (totalLabourCost / meters));
    setMaterialCost(totalPavingCost);
    setLabourCost(totalLabourCost);
    setMarginCost(totalMargin);
    setTotalCost(calculatedTotalCost);
    setHasCostData(true);
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts, concreteCosts]);

  // Mark changes when inputs change
  const handleSelectedPavingChange = useCallback((id: string) => {
    setSelectedPavingId(id);
    markAsChanged();
  }, [markAsChanged]);

  const handleMetersChange = useCallback((value: number) => {
    setMeters(value);
    markAsChanged();
  }, [markAsChanged]);

  // Save functions
  const saveExtraPavingData = async () => {
    if (!quoteData.id) return false;
    if (!selectedPavingId || meters <= 0) return false;
    
    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_paving_cost: totalCost,
          selected_paving_id: selectedPavingId,
          selected_paving_meters: meters,
          selected_paving_cost: totalCost,
          selected_paving_margin: marginCost,
        })
        .eq("id", quoteData.id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error("Error saving extra paving data:", error);
      return false;
    }
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
        const savePavingResult = await saveExtraPavingData();
        if (!savePavingResult) {
          isSaveSuccessful = false;
        }
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
        handleSelectedPavingChange("");
        handleMetersChange(0);
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
    hasExistingData,
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
