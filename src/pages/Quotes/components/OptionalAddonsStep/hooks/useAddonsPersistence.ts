import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseAddonsPersistenceProps {
  quoteId: string | undefined;
  calculateTotalCost: () => number;
}

export const useAddonsPersistence = ({
  quoteId,
  calculateTotalCost
}: UseAddonsPersistenceProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const saveAddons = async (continueToNext?: () => void) => {
    if (!quoteId) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Store as JSON strings for the custom fields
      const dataToSave = {
        optional_addons_cost: calculateTotalCost()
      };
      
      // Update the record in Supabase
      const { error } = await supabase
        .from('quotes')
        .update(dataToSave)
        .eq('id', quoteId);
      
      if (error) {
        console.error("Error updating optional addons:", error);
        throw error;
      }
      
      toast.success("Optional addons saved");
      setIsSubmitting(false);
      
      // Only call continueToNext if it's provided and it's a function
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
    isSubmitting,
    saveAddons
  };
};
