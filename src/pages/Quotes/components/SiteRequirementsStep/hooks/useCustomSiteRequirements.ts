
import { useState, useEffect } from "react";
import { CustomSiteRequirement } from "../types";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

export const useCustomSiteRequirements = () => {
  const { quoteData } = useQuoteContext();
  const [customRequirements, setCustomRequirements] = useState<CustomSiteRequirement[]>([
    { id: crypto.randomUUID(), description: "", price: 0 }
  ]);

  // Initialize from database data if provided
  useEffect(() => {
    if (quoteData.custom_requirements_json) {
      try {
        const parsedRequirements = JSON.parse(quoteData.custom_requirements_json);
        if (Array.isArray(parsedRequirements) && parsedRequirements.length > 0) {
          setCustomRequirements(parsedRequirements);
        }
      } catch (error) {
        console.error("Error parsing custom requirements JSON:", error);
      }
    }
  }, [quoteData.custom_requirements_json]);

  const addCustomRequirement = () => {
    setCustomRequirements([
      ...customRequirements,
      { id: crypto.randomUUID(), description: "", price: 0 }
    ]);
  };

  const removeCustomRequirement = (id: string) => {
    if (customRequirements.length > 1) {
      setCustomRequirements(customRequirements.filter(req => req.id !== id));
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
