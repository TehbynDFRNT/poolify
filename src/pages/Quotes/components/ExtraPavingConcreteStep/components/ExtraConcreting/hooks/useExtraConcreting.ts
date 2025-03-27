
import { useState, useEffect } from "react";
import { useExtraConcreting as useExtraConcretingData } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useExtraConcreting = (onChanged?: () => void) => {
  const { extraConcretingItems, isLoading } = useExtraConcretingData();
  const { quoteData, updateQuoteData, refreshQuoteData } = useQuoteContext();
  
  const [selectedType, setSelectedType] = useState<string>("");
  const [meterage, setMeterage] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load saved data when component mounts
  useEffect(() => {
    if (quoteData.extra_concreting_type) {
      setSelectedType(quoteData.extra_concreting_type);
      setHasExistingData(true);
    }
    
    if (quoteData.extra_concreting_meterage && quoteData.extra_concreting_meterage > 0) {
      setMeterage(quoteData.extra_concreting_meterage);
    }
    
    if (quoteData.extra_concreting_cost && quoteData.extra_concreting_cost > 0) {
      setTotalCost(quoteData.extra_concreting_cost);
    }
  }, [quoteData]);

  // Calculate total cost when type or meterage changes
  useEffect(() => {
    if (!selectedType || meterage <= 0) {
      setTotalCost(0);
      return;
    }
    
    const selectedConcrete = extraConcretingItems?.find(item => item.id === selectedType);
    if (selectedConcrete) {
      const calculatedCost = selectedConcrete.price * meterage;
      setTotalCost(calculatedCost);
      
      // Save changes automatically after a short delay
      const timer = setTimeout(() => {
        saveChanges(selectedType, meterage, calculatedCost, selectedConcrete.margin * meterage);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedType, meterage, extraConcretingItems]);

  // Save changes to the database
  const saveChanges = async (
    concreteType: string, 
    concreteMeterage: number, 
    concreteCost: number,
    marginCost: number
  ) => {
    if (!quoteData.id) return;
    
    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_concreting_type: concreteType,
          extra_concreting_meterage: concreteMeterage,
          extra_concreting_cost: concreteCost,
          extra_concreting_margin: marginCost
        })
        .eq("id", quoteData.id);
      
      if (error) {
        console.error("Error saving extra concreting data:", error);
        return;
      }
      
      // Update the local context
      updateQuoteData({
        extra_concreting_type: concreteType,
        extra_concreting_meterage: concreteMeterage,
        extra_concreting_cost: concreteCost,
        extra_concreting_margin: marginCost
      });
      
      setHasExistingData(true);
      
      // Notify parent component about changes
      if (onChanged) onChanged();
      
      // Refresh to update any calculated fields
      await refreshQuoteData();
    } catch (error) {
      console.error("Failed to save extra concreting data:", error);
    }
  };

  // Handle concrete type selection
  const handleTypeChange = (value: string) => {
    setSelectedType(value);
    if (onChanged) onChanged();
  };

  // Handle meterage changes
  const handleMeterageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    setMeterage(value);
    if (onChanged) onChanged();
  };

  // Get price for selected item
  const getSelectedPrice = (): number => {
    const selectedConcrete = extraConcretingItems?.find(item => item.id === selectedType);
    return selectedConcrete ? selectedConcrete.price : 0;
  };
  
  // Delete extra concreting data
  const handleDelete = async () => {
    if (!quoteData.id) return;
    
    setIsDeleting(true);
    
    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_concreting_type: null,
          extra_concreting_meterage: 0,
          extra_concreting_cost: 0,
          extra_concreting_margin: 0
        })
        .eq("id", quoteData.id);
      
      if (error) {
        console.error("Error removing extra concreting data:", error);
        toast.error("Failed to remove extra concreting data");
        return;
      }
      
      // Reset local state
      setSelectedType("");
      setMeterage(0);
      setTotalCost(0);
      setHasExistingData(false);
      
      // Update the context
      updateQuoteData({
        extra_concreting_type: null,
        extra_concreting_meterage: 0,
        extra_concreting_cost: 0,
        extra_concreting_margin: 0
      });
      
      // Notify parent component about changes
      if (onChanged) onChanged();
      
      // Refresh to update any calculated fields
      await refreshQuoteData();
      
      toast.success("Extra concreting data removed");
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error("Failed to remove extra concreting data:", error);
      toast.error("An error occurred while removing extra concreting data");
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    selectedType,
    meterage,
    totalCost,
    extraConcretingItems,
    isLoading,
    hasExistingData,
    isDeleting,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleTypeChange,
    handleMeterageChange,
    getSelectedPrice,
    handleDelete
  };
};
