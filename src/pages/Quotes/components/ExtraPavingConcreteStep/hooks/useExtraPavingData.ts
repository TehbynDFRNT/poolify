
import { useState, useEffect, useRef } from "react";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useSavePavingData } from "./useSavePavingData";
import { usePageSaveState } from "./usePageSaveState";
import { toast } from "sonner";

export const useExtraPavingData = (onNext: () => void) => {
  // Hooks for managing data
  const { quoteData, updateQuoteData, refreshQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isPavingLoading } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLabourLoading } = useConcreteLabourCosts();
  const { concreteCosts, isLoading: isConcreteLoading } = useConcreteCosts();
  
  // State for paving selection
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [perMeterCost, setPerMeterCost] = useState<number>(0);
  const [materialCost, setMaterialCost] = useState<number>(0);
  const [labourCost, setLabourCost] = useState<number>(0);
  const [marginCost, setMarginCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [pavingDetails, setPavingDetails] = useState<any>(null);
  const [concreteDetails, setConcreteDetails] = useState<any>(null);
  const [labourDetails, setLabourDetails] = useState<any>(null);
  const [hasCostData, setHasCostData] = useState<boolean>(false);
  
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
  }, [quoteData]);
  
  // Function to reset paving state
  const resetPavingState = () => {
    setSelectedPavingId("");
    setMeters(0);
    setPerMeterCost(0);
    setMaterialCost(0);
    setLabourCost(0);
    setMarginCost(0);
    setTotalCost(0);
    setPavingDetails(null);
    setConcreteDetails(null);
    setLabourDetails(null);
    setHasCostData(false);
  };
  
  // Calculate costs
  const calculateCosts = (pavingId: string, area: number) => {
    if (!pavingId || area <= 0 || !extraPavingCosts || !concreteLabourCosts || !concreteCosts) {
      resetPavingState();
      return;
    }
    
    const selectedPaving = extraPavingCosts.find(p => p.id === pavingId);
    if (!selectedPaving) {
      resetPavingState();
      return;
    }
    
    // Calculate paving costs
    const paverCost = selectedPaving.paver_cost;
    const wastageCost = selectedPaving.wastage_cost;
    const marginCostPerMeter = selectedPaving.margin_cost;
    
    // Calculate labour costs
    let totalLabourCost = 0;
    let totalLabourMargin = 0;
    
    concreteLabourCosts.forEach(labour => {
      totalLabourCost += labour.cost;
      totalLabourMargin += labour.margin;
    });
    
    // Calculate concrete costs
    let concreteCostPerMeter = 0;
    
    if (concreteCosts.length > 0) {
      concreteCostPerMeter = concreteCosts[0].price;
    }
    
    // Calculate totals
    const totalMaterialCost = (paverCost + wastageCost + concreteCostPerMeter) * area;
    const totalLabour = totalLabourCost * area;
    const totalMargin = (marginCostPerMeter + totalLabourMargin) * area;
    const perMeterTotal = paverCost + wastageCost + concreteCostPerMeter + totalLabourCost + marginCostPerMeter + totalLabourMargin;
    const calculatedTotalCost = totalMaterialCost + totalLabour + totalMargin;
    
    // Update state
    setPerMeterCost(perMeterTotal);
    setMaterialCost(totalMaterialCost);
    setLabourCost(totalLabour);
    setMarginCost(totalMargin);
    setTotalCost(calculatedTotalCost);
    setHasCostData(true);
    
    // Set details for display
    setPavingDetails({
      paverCost,
      wastageCost,
      marginCost: marginCostPerMeter
    });
    
    setConcreteDetails({
      costPerMeter: concreteCostPerMeter
    });
    
    setLabourDetails({
      baseCost: totalLabourCost,
      marginCost: totalLabourMargin
    });
  };
  
  // Update costs calculation when the paving selection or meters change
  useEffect(() => {
    if (selectedPavingId && meters > 0) {
      calculateCosts(selectedPavingId, meters);
    }
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts, concreteCosts]);
  
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
