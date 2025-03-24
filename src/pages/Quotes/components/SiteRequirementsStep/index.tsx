import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CraneSelector } from "./components/CraneSelector";
import { TrafficControlSelector } from "./components/TrafficControlSelector";
import { NoPoolWarning } from "./components/NoPoolWarning";
import { CostSummary } from "./components/CostSummary";
import { useSiteRequirementsCost } from "./hooks/useSiteRequirementsCost";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SiteRequirementsStep = ({ onNext, onPrevious }: SiteRequirementsStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { 
    siteRequirementsCost, 
    handleCraneChange, 
    handleTrafficControlChange 
  } = useSiteRequirementsCost();

  // Show warning but don't block progress if no pool is selected
  useEffect(() => {
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  const saveRequirements = async (continueToNext: boolean) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // These fields now exist in the database, so we can use type-safe updates
      const dataToSave = {
        crane_id: quoteData.crane_id || null,
        traffic_control_id: quoteData.traffic_control_id || 'none',
        site_requirements_cost: siteRequirementsCost
      };
      
      console.log("Saving site requirements:", dataToSave);
      
      // Update the record in Supabase
      const { error } = await supabase
        .from('quotes')
        .update(dataToSave)
        .eq('id', quoteData.id);
      
      if (error) {
        console.error("Error updating site requirements:", error);
        throw error;
      }
      
      toast.success("Site requirements saved");
      setIsSubmitting(false);
      if (continueToNext) onNext();
    } catch (error) {
      console.error("Error saving site requirements:", error);
      toast.error("Failed to save site requirements");
      setIsSubmitting(false);
    }
  };

  const handleSaveOnly = async () => {
    await saveRequirements(false);
  };

  const handleSaveAndContinue = async () => {
    await saveRequirements(true);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Configure the required site modifications for installing this pool (non-optional items needed for installation).
      </p>
      
      {!quoteData.pool_id && <NoPoolWarning />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CraneSelector 
          craneId={quoteData.crane_id} 
          onCraneChange={handleCraneChange} 
        />
        
        <TrafficControlSelector 
          trafficControlId={quoteData.traffic_control_id} 
          onTrafficControlChange={handleTrafficControlChange} 
        />
      </div>

      <CostSummary siteRequirementsCost={siteRequirementsCost} />

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
