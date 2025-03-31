
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
  
  // State for form inputs
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  
  // State for form operations
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Cost calculations
  const [pavingCost, setPavingCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [hasCostData, setHasCostData] = useState(false);
  const [hasExistingData, setHasExistingData] = useState(false);

  // Load existing data if available
  useEffect(() => {
    if (quoteData.existing_concrete_paving) {
      try {
        const savedData = JSON.parse(quoteData.existing_concrete_paving);
        if (savedData && savedData.paving_id) {
          setSelectedPavingId(savedData.paving_id);
          setMeters(savedData.meters || 0);
          setHasExistingData(true);
        }
      } catch (err) {
        console.error("Failed to parse saved existing concrete paving data:", err);
      }
    }
  }, [quoteData.existing_concrete_paving]);

  // Calculate costs when inputs change
  useEffect(() => {
    if (!selectedPavingId || meters <= 0 || !extraPavingCosts || !concreteLabourCosts) {
      setPavingCost(0);
      setLabourCost(0);
      setTotalCost(0);
      setHasCostData(false);
      return;
    }

    // Find the selected paving
    const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
    if (!selectedPaving) return;

    // Calculate paving cost (paver + wastage + margin)
    const perMeterPavingCost = selectedPaving.paver_cost + selectedPaving.wastage_cost + selectedPaving.margin_cost;
    const totalPavingCost = perMeterPavingCost * meters;
    setPavingCost(totalPavingCost);

    // Calculate labour cost
    const labourRatePerMeter = concreteLabourCosts.reduce((total, cost) => total + cost.cost + cost.margin, 0);
    const totalLabourCost = labourRatePerMeter * meters;
    setLabourCost(totalLabourCost);

    // Calculate total cost
    const calculatedTotalCost = totalPavingCost + totalLabourCost;
    setTotalCost(calculatedTotalCost);
    setHasCostData(true);
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts]);

  const handleSave = async () => {
    if (!selectedPavingId || meters <= 0) {
      toast.error("Please select a paving type and enter meters");
      return;
    }

    if (!quoteData.id) {
      toast.error("No quote ID available");
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected paving for details
      const selectedPaving = extraPavingCosts?.find(p => p.id === selectedPavingId);
      if (!selectedPaving) {
        toast.error("Selected paving type not found");
        setIsSubmitting(false);
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
        total_cost: totalCost,
        paving_details: {
          paverCost: selectedPaving.paver_cost,
          wastageCost: selectedPaving.wastage_cost,
          marginCost: selectedPaving.margin_cost
        },
        labour_details: labourDetails
      };

      // Create updates object for the quote
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
        setIsSubmitting(false);
        return;
      }

      // Update local context
      updateQuoteData(updates);
      setHasExistingData(true);
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
      toast.error("No quote ID available");
      return;
    }

    setIsDeleting(true);

    try {
      // Create updates to clear the existing data
      const updates: Partial<Quote> = {
        existing_concrete_paving: null,
        existing_concrete_paving_cost: 0
      };

      // Save to database
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
      
      // Clear form state
      setSelectedPavingId("");
      setMeters(0);
      setHasExistingData(false);
      setShowDeleteConfirm(false);
      
      toast.success("Paving on existing concrete data removed");
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingPaving || isLoadingLabour;

  return {
    // State
    selectedPavingId,
    meters,
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    pavingCost,
    labourCost,
    totalCost,
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
