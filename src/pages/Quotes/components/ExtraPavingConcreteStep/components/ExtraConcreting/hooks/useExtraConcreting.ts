
import { useState, useEffect } from "react";
import { useExtraConcreting as useExtraConcretingData } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";
import { formatCurrency } from "@/utils/format";

export const useExtraConcreting = (onChanged?: () => void) => {
  const { quoteData, updateQuoteData, refreshQuoteData } = useQuoteContext();
  const { extraConcretingItems, isLoading: isLoadingExtraConcreting } = useExtraConcretingData();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  
  // Form state
  const [selectedConcretingType, setSelectedConcretingType] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Cost calculations
  const [concreteCost, setConcreteCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [marginCost, setMarginCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [perMeterRate, setPerMeterRate] = useState(0);

  // Helper to update the parent about changes
  const notifyChanges = () => {
    if (onChanged) {
      onChanged();
    }
  };

  // Notify parent when inputs change
  useEffect(() => {
    if (selectedConcretingType || meters > 0) {
      notifyChanges();
    }
  }, [selectedConcretingType, meters]);

  // Load existing data if available
  useEffect(() => {
    // Check if there's existing extra_concreting_type and extra_concreting_meterage data
    if (quoteData.extra_concreting_type && quoteData.extra_concreting_meterage) {
      if (extraConcretingItems) {
        const matchingType = extraConcretingItems.find(
          item => item.type === quoteData.extra_concreting_type
        );
        
        if (matchingType) {
          setSelectedConcretingType(matchingType.id);
          setMeters(quoteData.extra_concreting_meterage);
        }
      }
    }
  }, [quoteData, extraConcretingItems]);

  // Calculate costs when inputs change
  useEffect(() => {
    if (!selectedConcretingType || meters <= 0 || !extraConcretingItems || !concreteCosts || !concreteLabourCosts) {
      resetAllCosts();
      return;
    }

    // Find the selected concreting
    const selectedConcreting = extraConcretingItems.find(c => c.id === selectedConcretingType);
    if (!selectedConcreting) return;
    
    // Get concrete cost
    const concrete = concreteCosts[0]; // Assuming there is at least one concrete cost
    if (!concrete) return;
    
    // Calculate base concrete cost
    const concreteMaterialCost = (concrete.concrete_cost + concrete.dust_cost) * meters;
    
    // Calculate labour cost
    let totalLabourCost = 0;
    concreteLabourCosts.forEach(labour => {
      totalLabourCost += (labour.cost + labour.margin) * meters;
    });
    
    // Calculate concreting margin
    const concretingMargin = selectedConcreting.margin * meters;
    
    // Calculate total
    const calculatedTotalCost = concreteMaterialCost + totalLabourCost + concretingMargin;
    
    // Calculate per meter rate
    const perMeterTotal = (concrete.concrete_cost + concrete.dust_cost) + 
                          concreteLabourCosts.reduce((acc, l) => acc + l.cost + l.margin, 0) +
                          selectedConcreting.margin;

    // Update state
    setConcreteCost(concreteMaterialCost);
    setLabourCost(totalLabourCost);
    setMarginCost(concretingMargin);
    setTotalCost(calculatedTotalCost);
    setPerMeterRate(perMeterTotal);
    
  }, [selectedConcretingType, meters, extraConcretingItems, concreteCosts, concreteLabourCosts]);

  const resetAllCosts = () => {
    setConcreteCost(0);
    setLabourCost(0);
    setMarginCost(0);
    setTotalCost(0);
    setPerMeterRate(0);
  };

  const handleSave = async () => {
    if (!selectedConcretingType || meters <= 0) {
      toast.error("Please select a concreting type and enter a valid area");
      return false;
    }

    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return false;
    }

    setIsSubmitting(true);

    try {
      // Find the selected concreting for details
      const selectedConcreting = extraConcretingItems?.find(c => c.id === selectedConcretingType);
      if (!selectedConcreting) {
        toast.error("Selected concreting type not found");
        return false;
      }

      // Create update object with specific fields instead of using a JSON string
      const updates: Partial<Quote> = {
        extra_concreting_cost: totalCost,
        extra_concreting_type: selectedConcreting.type,
        extra_concreting_meterage: meters,
        extra_concreting_margin: marginCost
      };

      console.log("Saving extra concreting with updates:", updates);

      // Save to database
      const { error } = await supabase
        .from("quotes")
        .update(updates)
        .eq("id", quoteData.id);

      if (error) {
        console.error("Error saving extra concreting data:", error);
        toast.error("Failed to save data");
        return false;
      }

      // Update local context
      updateQuoteData(updates);
      
      // Refresh quote data to get updated cost totals
      await refreshQuoteData();

      toast.success("Extra concreting data saved successfully");
      return true;
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
      return false;
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
      const updates: Partial<Quote> = {
        extra_concreting_cost: 0,
        extra_concreting_type: null,
        extra_concreting_meterage: 0,
        extra_concreting_margin: 0
      };
      
      // Update database
      const { error } = await supabase
        .from("quotes")
        .update(updates)
        .eq("id", quoteData.id);
      
      if (error) {
        console.error("Error removing extra concreting data:", error);
        toast.error("Failed to remove data");
        return;
      }
      
      // Update local context
      updateQuoteData(updates);
      
      // Reset local state
      setSelectedConcretingType("");
      setMeters(0);
      resetAllCosts();
      
      // Refresh quote data to get updated cost totals
      await refreshQuoteData();
      
      toast.success("Extra concreting data removed");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to get the selected concreting data
  const getSelectedConcreting = () => {
    if (!selectedConcretingType || !extraConcretingItems) return null;
    return extraConcretingItems.find(c => c.id === selectedConcretingType);
  };

  // Helper function to get the price of the selected concreting option
  const getSelectedPrice = () => {
    const selected = getSelectedConcreting();
    return selected ? selected.price : 0;
  };

  // Handler for type change
  const handleTypeChange = (value: string) => {
    setSelectedConcretingType(value);
  };

  // Handler for meterage change
  const handleMeterageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeters(parseFloat(e.target.value) || 0);
  };

  // Format values for display
  const getFormattedTotal = () => formatCurrency(totalCost);
  const getFormattedRate = () => formatCurrency(perMeterRate);

  const isLoading = isLoadingExtraConcreting || isLoadingConcrete || isLoadingLabour;
  const hasCostData = Boolean(selectedConcretingType && meters > 0);
  const hasExistingData = Boolean(quoteData.extra_concreting_type && quoteData.extra_concreting_meterage);

  return {
    // State
    selectedConcretingType,
    selectedType: selectedConcretingType, // Alias for component compatibility
    meters,
    meterage: meters, // Alias for component compatibility
    isSubmitting,
    isDeleting,
    showDeleteConfirm,
    hasCostData,
    hasExistingData,
    isLoading,
    
    // Cost breakdown data
    perMeterRate,
    concreteCost,
    labourCost,
    marginCost,
    totalCost,
    
    // Formatted values
    formattedTotal: getFormattedTotal(),
    formattedRate: getFormattedRate(),
    
    // Dependencies
    extraConcretingItems,
    
    // Actions
    setSelectedConcretingType,
    setMeters,
    setShowDeleteConfirm,
    handleSave,
    handleDelete,
    handleTypeChange,
    handleMeterageChange,
    getSelectedPrice,
    getSelectedConcreting
  };
};
