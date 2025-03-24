
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { CraneSelector } from "./components/CraneSelector";
import { TrafficControlSelector } from "./components/TrafficControlSelector";
import { CustomSiteRequirements } from "./components/CustomSiteRequirements";
import { MicroDigSection } from "./components/MicroDigSection";
import { NoPoolWarning } from "./components/NoPoolWarning";
import { CostSummary } from "./components/CostSummary";
import { useSiteRequirementsCost } from "./hooks/useSiteRequirementsCost";
import { useCustomSiteRequirements } from "./hooks/useCustomSiteRequirements";
import { useMicroDig } from "./hooks/useMicroDig";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";

interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SiteRequirementsStep = ({ onNext, onPrevious }: SiteRequirementsStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Custom hooks for different sections
  const { 
    siteRequirementsCost, 
    handleCraneChange, 
    handleTrafficControlChange 
  } = useSiteRequirementsCost();
  
  const {
    customRequirements,
    addCustomRequirement,
    removeCustomRequirement,
    updateCustomRequirement
  } = useCustomSiteRequirements();
  
  const {
    microDigRequired,
    setMicroDigRequired,
    microDigPrice,
    setMicroDigPrice,
    microDigNotes,
    setMicroDigNotes
  } = useMicroDig();

  // Show warning but don't block progress if no pool is selected
  useEffect(() => {
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  // Calculate total cost including custom requirements and micro dig
  const calculateTotalCost = () => {
    // Base site requirements cost (crane, traffic control)
    let totalCost = siteRequirementsCost;
    
    // Add custom requirements costs
    totalCost += customRequirements.reduce((sum, req) => sum + (req.price || 0), 0);
    
    // Add micro dig cost if required
    if (microDigRequired) {
      totalCost += microDigPrice;
    }
    
    return totalCost;
  };

  const saveRequirements = async (continueToNext: boolean) => {
    if (!quoteData.id) {
      toast.error("No quote ID found. Please complete the previous steps first.");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const totalCost = calculateTotalCost();
      
      // Data to save to database
      const dataToSave = {
        crane_id: quoteData.crane_id || null,
        traffic_control_id: quoteData.traffic_control_id || 'none',
        site_requirements_cost: totalCost,
        custom_requirements_json: JSON.stringify(customRequirements),
        micro_dig_required: microDigRequired,
        micro_dig_price: microDigPrice,
        micro_dig_notes: microDigNotes
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
      
      // Update context with the latest values
      updateQuoteData({
        site_requirements_cost: totalCost,
        custom_requirements_json: JSON.stringify(customRequirements),
        micro_dig_required: microDigRequired,
        micro_dig_price: microDigPrice,
        micro_dig_notes: microDigNotes
      });
      
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
      
      {/* Custom Site Requirements Section */}
      <CustomSiteRequirements 
        requirements={customRequirements}
        addRequirement={addCustomRequirement}
        removeRequirement={removeCustomRequirement}
        updateRequirement={updateCustomRequirement}
      />
      
      {/* Micro Dig Section */}
      <MicroDigSection 
        required={microDigRequired}
        setRequired={setMicroDigRequired}
        price={microDigPrice}
        setPrice={setMicroDigPrice}
        notes={microDigNotes}
        setNotes={setMicroDigNotes}
      />

      <CostSummary siteRequirementsCost={calculateTotalCost()} />

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
