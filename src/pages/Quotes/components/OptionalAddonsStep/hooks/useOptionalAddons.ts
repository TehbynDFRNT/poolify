
import { useEffect } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";
import { toast } from "sonner";
import { useStandardAddons } from "./useStandardAddons";
import { calculateAddonsCost } from "./utils/costCalculations";
import { useAddonsPersistence } from "./useAddonsPersistence";

export const useOptionalAddons = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  
  // Standard addons
  const { 
    addons, 
    toggleAddon, 
    updateQuantity 
  } = useStandardAddons();

  // Calculate total cost function for both UI and persistence
  const calculateTotalCost = () => {
    return calculateAddonsCost(addons);
  };

  // Persistence operations
  const { 
    isSubmitting, 
    saveAddons 
  } = useAddonsPersistence({
    quoteId: quoteData.id,
    calculateTotalCost
  });

  // Update total when values change
  useEffect(() => {
    const totalCost = calculateTotalCost();
    updateQuoteData({ 
      optional_addons_cost: totalCost
    });
  }, [addons]);

  // Show warning but don't block progress if no pool is selected
  useEffect(() => {
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  return {
    addons,
    isSubmitting,
    toggleAddon,
    updateQuantity,
    calculateAddonsCost: calculateTotalCost,
    saveAddons
  };
};
