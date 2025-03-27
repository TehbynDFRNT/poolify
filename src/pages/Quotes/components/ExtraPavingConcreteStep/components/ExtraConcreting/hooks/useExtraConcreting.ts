
import { useState, useEffect } from "react";
import { useExtraConcreting as useExtraConcretingData } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";

export const useExtraConcreting = (onChanged?: () => void) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
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
    if (quoteData.extra_concreting) {
      try {
        let savedData;
        if (typeof quoteData.extra_concreting === 'string') {
          savedData = JSON.parse(quoteData.extra_concreting);
        } else {
          savedData = quoteData.extra_concreting;
        }
        
        if (savedData && savedData.concreting_type) {
          setSelectedConcretingType(savedData.concreting_type);
          setMeters(parseFloat(savedData.meters) || 0);
        }
      } catch (err) {
        console.error("Failed to parse saved extra concreting data:", err);
      }
    }
  }, [quoteData.extra_concreting]);

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

      // Prepare the data to save
      const concretingData = {
        concreting_type: selectedConcretingType,
        concreting_price: selectedConcreting.price,
        meters: meters,
        material_cost: concreteCost,
        labour_cost: labourCost,
        margin_cost: marginCost,
        total_cost: totalCost,
        per_meter_rate: perMeterRate
      };

      if (quoteData.id) {
        const updates: Partial<Quote> = {
          extra_concreting_cost: totalCost,
          extra_concreting_type: selectedConcreting.type,
          extra_concreting_meterage: meters,
          extra_concreting_margin: marginCost,
          extra_concreting: JSON.stringify(concretingData)
        };

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
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!quoteData.id) return;
    
    setIsDeleting(true);
    
    try {
      const updates: Partial<Quote> = {
        extra_concreting: null,
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
      
      toast.success("Extra concreting data removed");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to get the price of the selected concreting option
  const getSelectedPrice = () => {
    if (!selectedConcretingType || !extraConcretingItems) return 0;
    const selectedConcreting = extraConcretingItems.find(c => c.id === selectedConcretingType);
    return selectedConcreting ? selectedConcreting.price : 0;
  };

  // Handler for type change
  const handleTypeChange = (value: string) => {
    setSelectedConcretingType(value);
  };

  // Handler for meterage change
  const handleMeterageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMeters(parseFloat(e.target.value) || 0);
  };

  const isLoading = isLoadingExtraConcreting || isLoadingConcrete || isLoadingLabour;
  const hasCostData = selectedConcretingType && meters > 0;
  const hasExistingData = !!quoteData.extra_concreting;

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
    getSelectedPrice
  };
};
