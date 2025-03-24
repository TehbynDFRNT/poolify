
import { useState, useEffect } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Addon, CustomRequirement } from "../types";

export const useOptionalAddons = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Standard addons
  const [addons, setAddons] = useState<Addon[]>([
    {
      id: "pool-cleaner",
      name: "Automatic Pool Cleaner",
      description: "Keeps your pool clean with minimal effort",
      price: 699,
      selected: false,
      quantity: 1
    },
    {
      id: "led-lighting",
      name: "LED Pool Lighting",
      description: "Illuminates your pool with energy-efficient LED lights",
      price: 499,
      selected: false,
      quantity: 1
    },
    {
      id: "heating-system",
      name: "Pool Heating System",
      description: "Extends your swimming season with temperature control",
      price: 1299,
      selected: false,
      quantity: 1
    },
    {
      id: "salt-system",
      name: "Salt Chlorination System",
      description: "Natural water treatment without harsh chemicals",
      price: 899,
      selected: false,
      quantity: 1
    },
    {
      id: "pool-cover",
      name: "Automatic Pool Cover",
      description: "Safety and heat retention with automated opening/closing",
      price: 1599,
      selected: false,
      quantity: 1
    }
  ]);
  
  // Dynamic custom requirements
  const [customRequirements, setCustomRequirements] = useState<CustomRequirement[]>([
    { id: crypto.randomUUID(), description: "", price: 0 }
  ]);
  
  // Micro dig section
  const [microDigRequired, setMicroDigRequired] = useState(false);
  const [microDigPrice, setMicroDigPrice] = useState(0);
  const [microDigNotes, setMicroDigNotes] = useState("");

  // Calculate total addons cost including custom requirements and micro dig
  const calculateAddonsCost = () => {
    const standardAddonsCost = addons.reduce((total, addon) => {
      if (addon.selected) {
        return total + (addon.price * addon.quantity);
      }
      return total;
    }, 0);
    
    const customRequirementsCost = customRequirements.reduce((total, requirement) => {
      return total + (Number(requirement.price) || 0);
    }, 0);
    
    const microDigCost = microDigRequired ? Number(microDigPrice) : 0;
    
    return standardAddonsCost + customRequirementsCost + microDigCost;
  };

  // Update total when values change
  useEffect(() => {
    const totalCost = calculateAddonsCost();
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

  const toggleAddon = (id: string) => {
    setAddons(addons.map(addon => {
      if (addon.id === id) {
        return { ...addon, selected: !addon.selected };
      }
      return addon;
    }));
  };

  const updateQuantity = (id: string, increment: boolean) => {
    setAddons(addons.map(addon => {
      if (addon.id === id) {
        const newQuantity = increment 
          ? addon.quantity + 1 
          : Math.max(1, addon.quantity - 1);
        return { ...addon, quantity: newQuantity };
      }
      return addon;
    }));
  };

  // Handle custom requirements changes
  const addCustomRequirement = () => {
    setCustomRequirements([
      ...customRequirements, 
      { id: crypto.randomUUID(), description: "", price: 0 }
    ]);
  };

  const removeCustomRequirement = (id: string) => {
    if (customRequirements.length > 1) {
      setCustomRequirements(customRequirements.filter(req => req.id !== id));
    } else {
      toast.info("You must have at least one custom requirement field");
    }
  };

  const updateCustomRequirement = (id: string, field: 'description' | 'price', value: string) => {
    setCustomRequirements(customRequirements.map(req => {
      if (req.id === id) {
        return { 
          ...req, 
          [field]: field === 'price' ? Number(value) || 0 : value 
        };
      }
      return req;
    }));
  };

  // Fixed: Changed the continueToNext parameter from a boolean to a function,
  // and properly handled the case where it's not provided
  const saveAddons = async (continueToNext?: () => void) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store as JSON strings for the custom fields
      const dataToSave = {
        optional_addons_cost: calculateAddonsCost(),
        custom_requirements_json: JSON.stringify(customRequirements),
        micro_dig_required: microDigRequired,
        micro_dig_price: microDigPrice,
        micro_dig_notes: microDigNotes
      };
      
      // Update the record in Supabase
      const { error } = await supabase
        .from('quotes')
        .update(dataToSave)
        .eq('id', quoteData.id);
      
      if (error) {
        console.error("Error updating optional addons:", error);
        throw error;
      }
      
      toast.success("Optional addons saved");
      setIsSubmitting(false);
      
      // Fixed: Only call continueToNext if it's provided and it's a function
      if (continueToNext && typeof continueToNext === 'function') {
        continueToNext();
      }
    } catch (error) {
      console.error("Error saving optional addons:", error);
      toast.error("Failed to save optional addons");
      setIsSubmitting(false);
    }
  };

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
    calculateAddonsCost,
    saveAddons
  };
};
