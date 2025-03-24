import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface CostSummaryStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const CostSummaryStep = ({ onNext, onPrevious }: CostSummaryStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Show warning but don't block progress
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  const saveCostSummary = async (continueToNext: boolean) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate total cost from components
      const totalCost = (
        (quoteData.site_requirements_cost || 0) + 
        (quoteData.optional_addons_cost || 0)
        // Base pool cost would be added here in the future
      );
      
      // Update the context with the calculated total
      updateQuoteData({ total_cost: totalCost });
      
      // These fields now exist in the database, so we can use type-safe updates
      const dataToSave = {
        total_cost: totalCost
      };
      
      // Update the record in Supabase
      const { error } = await supabase
        .from('quotes')
        .update(dataToSave)
        .eq('id', quoteData.id);
      
      if (error) {
        console.error("Error updating cost summary:", error);
        throw error;
      }
      
      toast.success("Cost summary saved");
      setIsSubmitting(false);
      if (continueToNext) onNext();
    } catch (error) {
      console.error("Error saving cost summary:", error);
      toast.error("Failed to save cost summary");
      setIsSubmitting(false);
    }
  };

  const handleSaveOnly = async () => {
    await saveCostSummary(false);
  };

  const handleSaveAndContinue = async () => {
    await saveCostSummary(true);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Review the complete cost breakdown for this quote.
      </p>
      
      {/* This will be implemented with the actual cost summary components */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Base Pool Cost</span>
              <span>$XX,XXX</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Site Requirements</span>
              <span>${quoteData.site_requirements_cost ? quoteData.site_requirements_cost.toFixed(2) : "0.00"}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Optional Add-ons</span>
              <span>${quoteData.optional_addons_cost ? quoteData.optional_addons_cost.toFixed(2) : "0.00"}</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total Cost</span>
              <span>${quoteData.total_cost ? quoteData.total_cost.toFixed(2) : "XX,XXX"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
