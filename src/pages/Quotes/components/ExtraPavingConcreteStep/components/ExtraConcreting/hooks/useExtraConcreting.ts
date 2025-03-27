
import { useState, useEffect } from "react";
import { useExtraConcreting as useExtraConcretingData } from "@/pages/ConstructionCosts/hooks/useExtraConcreting";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export const useExtraConcreting = (onChanged?: () => void) => {
  const { extraConcretingItems, isLoading } = useExtraConcretingData();
  const { quoteData, updateQuoteData } = useQuoteContext();
  
  const [selectedType, setSelectedType] = useState<string>("");
  const [meterage, setMeterage] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);

  // Load saved data when component mounts
  useEffect(() => {
    if (quoteData.extra_concreting_type) {
      setSelectedType(quoteData.extra_concreting_type);
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
      
      // Update quote data with new calculations
      updateQuoteData({
        extra_concreting_type: selectedType,
        extra_concreting_meterage: meterage,
        extra_concreting_cost: calculatedCost,
        extra_concreting_margin: selectedConcrete.margin * meterage
      });
      
      if (onChanged) onChanged();
    }
  }, [selectedType, meterage, extraConcretingItems, onChanged, updateQuoteData]);

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

  return {
    selectedType,
    meterage,
    totalCost,
    extraConcretingItems,
    isLoading,
    handleTypeChange,
    handleMeterageChange,
    getSelectedPrice
  };
};
