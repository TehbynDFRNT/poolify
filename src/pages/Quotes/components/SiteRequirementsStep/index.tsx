
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { CraneSelector } from "./components/CraneSelector";
import { TrafficControlSelector } from "./components/TrafficControlSelector";
import { NoPoolWarning } from "./components/NoPoolWarning";
import { CostSummary } from "./components/CostSummary";
import { useSiteRequirementsCost } from "./hooks/useSiteRequirementsCost";

interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SiteRequirementsStep = ({ onNext, onPrevious }: SiteRequirementsStepProps) => {
  const { quoteData } = useQuoteContext();
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
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};
