
import { useEffect } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";

export const useOptionalAddons = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  
  // Move the state update to a useEffect so it only runs once after mount
  useEffect(() => {
    // Only update if the value is different to avoid unnecessary re-renders
    if (quoteData.optional_addons_cost !== 0) {
      updateQuoteData({ 
        optional_addons_cost: 0
      });
    }
  }, []);  // Empty dependency array ensures this only runs once after mount

  // This is a placeholder that will be implemented in the future
  return {
    calculateAddonsCost: () => 0,
    saveAddons: async (continueToNext?: () => void) => {
      if (continueToNext) {
        continueToNext();
      }
    }
  };
};
