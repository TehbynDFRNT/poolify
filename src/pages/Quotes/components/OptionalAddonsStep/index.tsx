import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface OptionalAddonsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const OptionalAddonsStep = ({ onNext, onPrevious }: OptionalAddonsStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Show warning but don't block progress if no pool is selected
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  const saveAddons = async (continueToNext: boolean) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // These fields now exist in the database, so we can use type-safe updates
      const dataToSave = {
        optional_addons_cost: quoteData.optional_addons_cost || 0
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
      if (continueToNext) onNext();
    } catch (error) {
      console.error("Error saving optional addons:", error);
      toast.error("Failed to save optional addons");
      setIsSubmitting(false);
    }
  };

  const handleSaveOnly = async () => {
    await saveAddons(false);
  };

  const handleSaveAndContinue = async () => {
    await saveAddons(true);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enhance the pool installation with optional add-ons and upgrades.
      </p>
      
      {/* This will be implemented with the actual optional add-ons form elements */}
      <div className="min-h-[200px] flex items-center justify-center border rounded-md p-6">
        <p className="text-muted-foreground">
          Optional add-ons form coming soon. This will include extra paving, fencing, pool cleaners, additional lighting, water features, and more.
        </p>
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveOnly}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button 
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
