
import { useQuoteContext } from "../../../context/QuoteContext";

export const useOptionalAddons = () => {
  const { updateQuoteData } = useQuoteContext();
  
  // Set optional_addons_cost to 0 for now
  updateQuoteData({ 
    optional_addons_cost: 0
  });

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
