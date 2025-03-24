
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CustomRequirement } from "../types";
import { UseCustomRequirementsReturn } from "./types";

export const useCustomRequirements = (initialRequirements?: CustomRequirement[]): UseCustomRequirementsReturn => {
  const [customRequirements, setCustomRequirements] = useState<CustomRequirement[]>(
    initialRequirements || [{ id: crypto.randomUUID(), description: "", price: 0 }]
  );

  // Initialize from database data if provided
  useEffect(() => {
    if (initialRequirements && initialRequirements.length > 0) {
      setCustomRequirements(initialRequirements);
    }
  }, [initialRequirements]);

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

  return {
    customRequirements,
    addCustomRequirement,
    removeCustomRequirement,
    updateCustomRequirement
  };
};
