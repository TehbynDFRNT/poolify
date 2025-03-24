
import { useEffect } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";
import { toast } from "sonner";
import { useStandardAddons } from "./useStandardAddons";
import { useCustomRequirements } from "./useCustomRequirements";
import { useMicroDig } from "./useMicroDig";
import { calculateAddonsCost } from "./utils/costCalculations";
import { useAddonsPersistence } from "./useAddonsPersistence";
import { CustomRequirement } from "../types";

export const useOptionalAddons = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  
  // Parse custom requirements from context if available
  const initialCustomRequirements = quoteData.custom_requirements_json 
    ? JSON.parse(quoteData.custom_requirements_json as string) 
    : undefined;
  
  // Standard addons
  const { 
    addons, 
    toggleAddon, 
    updateQuantity 
  } = useStandardAddons();
  
  // Custom requirements with initialization from context
  const { 
    customRequirements, 
    addCustomRequirement, 
    removeCustomRequirement, 
    updateCustomRequirement 
  } = useCustomRequirements(initialCustomRequirements);
  
  // Micro dig with initialization from context
  const { 
    microDigRequired, 
    setMicroDigRequired, 
    microDigPrice, 
    setMicroDigPrice, 
    microDigNotes, 
    setMicroDigNotes 
  } = useMicroDig();

  // Initialize micro dig values from context if available
  useEffect(() => {
    if (quoteData.micro_dig_required !== undefined) {
      setMicroDigRequired(quoteData.micro_dig_required);
    }
    
    if (quoteData.micro_dig_price !== undefined) {
      setMicroDigPrice(quoteData.micro_dig_price);
    }
    
    if (quoteData.micro_dig_notes) {
      setMicroDigNotes(quoteData.micro_dig_notes);
    }
  }, [quoteData.id]); // Only run once when the quote ID is loaded

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
