
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";

export const usePavingOnExistingConcrete = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  
  // Form state
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cost calculations
  const [materialCost, setMaterialCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [marginCost, setMarginCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [perMeterRate, setPerMeterRate] = useState(0);
  
  // Per metre cost details
  const [paverCost, setPaverCost] = useState(0);
  const [wastageCost, setWastageCost] = useState(0);
  const [marginPaverCost, setMarginPaverCost] = useState(0);
  const [labourBaseCost, setLabourBaseCost] = useState(0);
  const [labourMarginCost, setLabourMarginCost] = useState(0);

  // Load existing data if available
  useEffect(() => {
    if (quoteData.existing_concrete_paving) {
      try {
        const savedData = JSON.parse(quoteData.existing_concrete_paving);
        if (savedData && savedData.paving_id) {
          setSelectedPavingId(savedData.paving_id);
          setMeters(savedData.meters || 0);
        }
      } catch (err) {
        console.error("Failed to parse saved existing concrete paving data:", err);
      }
    }
  }, [quoteData.existing_concrete_paving]);

  // Calculate costs when inputs change
  useEffect(() => {
    if (!selectedPavingId || meters <= 0 || !extraPavingCosts || !concreteLabourCosts) {
      resetAllCosts();
      return;
    }

    // Find the selected paving
    const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
    if (!selectedPaving) return;
    
    // Set individual per meter costs
    setPaverCost(selectedPaving.paver_cost);
    setWastageCost(selectedPaving.wastage_cost);
    setMarginPaverCost(selectedPaving.margin_cost);
    
    // Calculate labour costs
    let totalLabourBase = 0;
    let totalLabourMargin = 0;
    
    concreteLabourCosts.forEach(labour => {
      totalLabourBase += labour.cost;
      totalLabourMargin += labour.margin;
    });
    
    setLabourBaseCost(totalLabourBase);
    setLabourMarginCost(totalLabourMargin);
    
    // Calculate per meter rate (NO concrete costs since it's existing concrete)
    const perMeterTotal = selectedPaving.paver_cost + 
                          selectedPaving.wastage_cost + 
                          selectedPaving.margin_cost +
                          totalLabourBase +
                          totalLabourMargin;
    
    setPerMeterRate(perMeterTotal);
    
    // Calculate total costs
    const totalMaterialCost = (selectedPaving.paver_cost + 
                              selectedPaving.wastage_cost) * meters;
    
    const totalLabourCost = totalLabourBase * meters;
    const totalMarginCost = (selectedPaving.margin_cost + totalLabourMargin) * meters;
    const calculatedTotalCost = totalMaterialCost + totalLabourCost + totalMarginCost;
    
    // Update state
    setMaterialCost(totalMaterialCost);
    setLabourCost(totalLabourCost);
    setMarginCost(totalMarginCost);
    setTotalCost(calculatedTotalCost);
    
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts]);

  const resetAllCosts = () => {
    setMaterialCost(0);
    setLabourCost(0);
    setMarginCost(0);
    setTotalCost(0);
    setPerMeterRate(0);
    setPaverCost(0);
    setWastageCost(0);
    setMarginPaverCost(0);
    setLabourBaseCost(0);
    setLabourMarginCost(0);
  };

  const handleSave = async () => {
    if (!selectedPavingId || meters <= 0) {
      // Don't show error if nothing is selected - this is optional
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected paving for details
      const selectedPaving = extraPavingCosts?.find(p => p.id === selectedPavingId);
      if (!selectedPaving) {
        toast.error("Selected paving type not found");
        return;
      }

      // Prepare the data to save
      const pavingData = {
        paving_id: selectedPavingId,
        paving_category: selectedPaving.category,
        meters: meters,
        material_cost: materialCost,
        labour_cost: labourCost,
        margin_cost: marginCost,
        total_cost: totalCost,
        per_meter_rate: perMeterRate,
        paving_details: {
          paverCost: selectedPaving.paver_cost,
          wastageCost: selectedPaving.wastage_cost,
          marginCost: selectedPaving.margin_cost
        },
        labour_details: {
          baseCost: labourBaseCost,
          marginCost: labourMarginCost
        }
      };

      if (quoteData.id) {
        const updates: Partial<Quote> = {
          existing_concrete_paving: JSON.stringify(pavingData),
          existing_concrete_paving_cost: totalCost
        };

        // Save to database
        const { error } = await supabase
          .from("quotes")
          .update(updates)
          .eq("id", quoteData.id);

        if (error) {
          console.error("Error saving existing concrete paving data:", error);
          toast.error("Failed to save data");
          return;
        }

        // Update local context
        updateQuoteData(updates);
        toast.success("Paving on existing concrete data saved");
      }
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!quoteData.id) return;
    
    setIsDeleting(true);
    
    try {
      const updates: Partial<Quote> = {
        existing_concrete_paving: null,
        existing_concrete_paving_cost: 0
      };
      
      // Update database
      const { error } = await supabase
        .from("quotes")
        .update(updates)
        .eq("id", quoteData.id);
      
      if (error) {
        console.error("Error removing existing concrete paving data:", error);
        toast.error("Failed to remove data");
        return;
      }
      
      // Update local context
      updateQuoteData(updates);
      
      // Reset local state
      setSelectedPavingId("");
      setMeters(0);
      resetAllCosts();
      
      toast.success("Paving on existing concrete data removed");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingPaving || isLoadingLabour;
  const hasCostData = selectedPavingId && meters > 0;
  const hasExistingData = !!quoteData.existing_concrete_paving;

  return {
    // State
    selectedPavingId,
    meters,
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    hasCostData,
    hasExistingData,
    isLoading,
    
    // Cost breakdown data
    perMeterRate,
    materialCost,
    labourCost,
    marginCost,
    totalCost,
    
    // Cost details
    paverCost,
    wastageCost,
    marginPaverCost,
    labourBaseCost,
    labourMarginCost,
    
    // Dependencies
    extraPavingCosts,
    
    // Actions
    setSelectedPavingId,
    setMeters,
    setShowDeleteConfirm,
    handleSave,
    handleDelete
  };
};
