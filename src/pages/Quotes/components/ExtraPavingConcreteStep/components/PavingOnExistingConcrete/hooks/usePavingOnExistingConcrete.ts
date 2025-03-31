
import { useState, useEffect } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const usePavingOnExistingConcrete = (onChanged?: () => void) => {
  const { quoteData, refreshQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  
  // UI state
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Cost calculation state
  const [perMeterRate, setPerMeterRate] = useState<number>(0);
  const [pavingCost, setPavingCost] = useState<number>(0);
  const [labourCost, setLabourCost] = useState<number>(0);
  const [marginCost, setMarginCost] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  
  // Detailed cost breakdown
  const [paverCost, setPaverCost] = useState<number>(0);
  const [wastageCost, setWastageCost] = useState<number>(0);
  const [marginPaverCost, setMarginPaverCost] = useState<number>(0);
  const [labourBaseCost, setLabourBaseCost] = useState<number>(0);
  const [labourMarginCost, setLabourMarginCost] = useState<number>(0);

  // Load existing data if available
  useEffect(() => {
    if (quoteData.existing_concrete_paving) {
      try {
        const savedData = JSON.parse(quoteData.existing_concrete_paving);
        if (savedData && savedData.paving_id) {
          setSelectedPavingId(savedData.paving_id);
          setMeters(Number(savedData.meters) || 0);
          
          // If we have detailed costs saved, load them too
          if (savedData.paving_details) {
            setPaverCost(savedData.paving_details.paverCost || 0);
            setWastageCost(savedData.paving_details.wastageCost || 0);
            setMarginPaverCost(savedData.paving_details.marginCost || 0);
          }
          
          if (savedData.labour_details && savedData.labour_details.length > 0) {
            const baseLabourCost = savedData.labour_details.reduce((sum: number, item: any) => 
              sum + (item.cost || 0), 0);
            const marginLabourCost = savedData.labour_details.reduce((sum: number, item: any) => 
              sum + (item.margin || 0), 0);
              
            setLabourBaseCost(baseLabourCost);
            setLabourMarginCost(marginLabourCost);
          }
        }
      } catch (err) {
        console.error("Failed to parse saved existing concrete paving data:", err);
      }
    }
  }, [quoteData.existing_concrete_paving]);

  // Calculate costs when inputs change
  useEffect(() => {
    if (!selectedPavingId || meters <= 0 || !extraPavingCosts || !concreteLabourCosts) {
      // Reset all cost values to zero
      setPerMeterRate(0);
      setPavingCost(0);
      setLabourCost(0);
      setMarginCost(0);
      setTotalCost(0);
      return;
    }

    // Find the selected paving
    const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
    if (!selectedPaving) return;

    // Store individual cost components
    const paverCostValue = selectedPaving.paver_cost || 0;
    const wastageCostValue = selectedPaving.wastage_cost || 0;
    const marginCostValue = selectedPaving.margin_cost || 0;
    
    setPaverCost(paverCostValue);
    setWastageCost(wastageCostValue);
    setMarginPaverCost(marginCostValue);

    // Calculate paving cost (paver + wastage + margin)
    const perMeterPavingCost = paverCostValue + wastageCostValue + marginCostValue;
    setPerMeterRate(perMeterPavingCost);
    
    const totalPavingCost = perMeterPavingCost * meters;
    setPavingCost(totalPavingCost);

    // Store and calculate labour costs
    let labourRatePerMeter = 0;
    let labourMarginPerMeter = 0;
    
    if (concreteLabourCosts && concreteLabourCosts.length > 0) {
      labourRatePerMeter = concreteLabourCosts.reduce((total, cost) => 
        total + (cost.cost || 0), 0);
      
      labourMarginPerMeter = concreteLabourCosts.reduce((total, cost) => 
        total + (cost.margin || 0), 0);
        
      setLabourBaseCost(labourRatePerMeter);
      setLabourMarginCost(labourMarginPerMeter);
    }
    
    const totalLabourRate = labourRatePerMeter + labourMarginPerMeter;
    const totalLabourCost = totalLabourRate * meters;
    setLabourCost(totalLabourCost);

    // Calculate total margin (from paving and labour)
    const totalMargin = (marginCostValue * meters) + (labourMarginPerMeter * meters);
    setMarginCost(totalMargin);

    // Calculate total cost
    const calculatedTotalCost = totalPavingCost + totalLabourCost;
    setTotalCost(calculatedTotalCost);

    // Notify parent component of changes if callback provided
    if (onChanged) {
      onChanged();
    }
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts, onChanged]);

  const handleSave = async () => {
    if (!selectedPavingId || meters <= 0) {
      toast.error("Please select a paving type and enter a valid area");
      return;
    }

    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
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

      // Get labour details
      const labourDetails = concreteLabourCosts?.map(l => ({
        description: l.description,
        cost: l.cost,
        margin: l.margin
      }));

      // Prepare the data to save
      const pavingData = {
        paving_id: selectedPavingId,
        paving_category: selectedPaving.category,
        meters: meters,
        paving_cost: pavingCost,
        labour_cost: labourCost,
        margin_cost: marginCost,
        total_cost: totalCost,
        paving_details: {
          paverCost: paverCost,
          wastageCost: wastageCost,
          marginCost: marginPaverCost
        },
        labour_details: labourDetails,
        per_meter_rate: perMeterRate
      };

      // Save to database
      const { error } = await supabase
        .from("quotes")
        .update({
          existing_concrete_paving: JSON.stringify(pavingData),
          existing_concrete_paving_cost: totalCost
        })
        .eq("id", quoteData.id);

      if (error) {
        console.error("Error saving existing concrete paving data:", error);
        toast.error("Failed to save data");
        return;
      }

      // Refresh quote data to get updated cost totals
      await refreshQuoteData();
      
      toast.success("Paving on existing concrete data saved");
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!quoteData.id) {
      toast.error("No quote ID found");
      return;
    }

    setIsDeleting(true);

    try {
      // Update the database, removing existing concrete paving data
      const { error } = await supabase
        .from("quotes")
        .update({
          existing_concrete_paving: null,
          existing_concrete_paving_cost: 0
        })
        .eq("id", quoteData.id);

      if (error) {
        console.error("Error deleting existing concrete paving data:", error);
        toast.error("Failed to delete data");
        return;
      }

      // Reset local state
      setSelectedPavingId("");
      setMeters(0);
      setPavingCost(0);
      setLabourCost(0);
      setTotalCost(0);
      setMarginCost(0);
      setPaverCost(0);
      setWastageCost(0);
      setMarginPaverCost(0);
      setLabourBaseCost(0);
      setLabourMarginCost(0);

      // Close confirm dialog
      setShowDeleteConfirm(false);
      
      // Refresh quote data to get updated cost totals
      await refreshQuoteData();
      
      toast.success("Paving on existing concrete data removed");
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingPaving || isLoadingLabour;
  const hasCostData = Boolean(selectedPavingId && meters > 0);
  const hasExistingData = Boolean(quoteData.existing_concrete_paving);

  return {
    // State
    selectedPavingId,
    meters,
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    perMeterRate,
    pavingCost,
    labourCost,
    marginCost,
    totalCost,
    paverCost,
    wastageCost,
    marginPaverCost,
    labourBaseCost,
    labourMarginCost,
    isLoading,
    hasCostData,
    hasExistingData,
    extraPavingCosts,
    
    // Actions
    setSelectedPavingId,
    setMeters,
    setShowDeleteConfirm,
    handleSave,
    handleDelete
  };
};
