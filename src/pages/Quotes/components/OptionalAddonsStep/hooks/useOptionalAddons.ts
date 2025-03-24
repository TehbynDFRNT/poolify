
import { useEffect } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";
import { toast } from "sonner";
import { useStandardAddons } from "./useStandardAddons";
import { useCustomRequirements } from "./useCustomRequirements";
import { useMicroDig } from "./useMicroDig";
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
  
  // Custom requirements
  const { 
    customRequirements, 
    addCustomRequirement, 
    removeCustomRequirement, 
    updateCustomRequirement 
  } = useCustomRequirements();
  
  // Micro dig
  const { 
    microDigRequired, 
    setMicroDigRequired, 
    microDigPrice, 
    setMicroDigPrice, 
    microDigNotes, 
    setMicroDigNotes 
  } = useMicroDig();

  // Calculate total cost function for both UI and persistence
  const calculateTotalCost = () => {
    return calculateAddonsCost(
      addons,
      customRequirements,
      microDigRequired,
      microDigPrice
    );
  };

  // Persistence operations
  const { 
    isSubmitting, 
    saveAddons 
  } = useAddonsPersistence({
    quoteId: quoteData.id,
    calculateTotalCost,
    customRequirements,
    microDigRequired,
    microDigPrice,
    microDigNotes
  });

  // Update total when values change
  useEffect(() => {
    const totalCost = calculateTotalCost();
    updateQuoteData({ 
      optional_addons_cost: totalCost,
      // Store additional data in context for future use
      custom_requirements_json: JSON.stringify(customRequirements),
      micro_dig_required: microDigRequired,
      micro_dig_price: microDigPrice,
      micro_dig_notes: microDigNotes
    });
  }, [addons, customRequirements, microDigRequired, microDigPrice]);

  // Show warning but don't block progress if no pool is selected
  useEffect(() => {
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  return {
    addons,
    customRequirements,
    microDigRequired,
    setMicroDigRequired,
    microDigPrice,
    setMicroDigPrice,
    microDigNotes,
    setMicroDigNotes,
    isSubmitting,
    toggleAddon,
    updateQuantity,
    addCustomRequirement,
    removeCustomRequirement,
    updateCustomRequirement,
    calculateAddonsCost: calculateTotalCost,
    saveAddons
  };
};
