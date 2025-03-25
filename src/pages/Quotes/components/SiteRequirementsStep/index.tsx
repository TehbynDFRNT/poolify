
import { useEffect } from "react";
import { useQuoteContext } from "../../context/QuoteContext";
import { toast } from "sonner";
import { NoPoolWarning } from "./components/NoPoolWarning";
import { CostSummary } from "./components/CostSummary";
import { useSiteRequirementsCost } from "./hooks/useSiteRequirementsCost";
import { useCustomSiteRequirements } from "./hooks/useCustomSiteRequirements";
import { useMicroDig } from "./hooks/useMicroDig";
import { useBobcat } from "./hooks/useBobcat";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { SiteRequirementsSection } from "./components/SiteRequirementsSection";
import { CustomSiteRequirements } from "./components/CustomSiteRequirements";
import { MicroDigSection } from "./components/MicroDigSection";
import { FormHeader } from "./components/FormHeader";
import { FormActions } from "./components/FormActions";

interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SiteRequirementsStep = ({ onNext, onPrevious }: SiteRequirementsStepProps) => {
  const { quoteData } = useQuoteContext();
  
  // Custom hooks for different sections
  const { 
    siteRequirementsCost, 
    handleCraneChange, 
    handleTrafficControlChange,
    handleBobcatChange 
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

  // Form submission hook
  const { isSubmitting, handleSaveRequirements } = useFormSubmission({ onNext });

  // Show warning but don't block progress if no pool is selected
  useEffect(() => {
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  // Calculate total cost including custom requirements and micro dig
  const calculateTotalCost = () => {
    // Base site requirements cost (crane, traffic control, bobcat)
    let totalCost = siteRequirementsCost;
    
    // Add custom requirements costs
    totalCost += customRequirements.reduce((sum, req) => sum + (req.price || 0), 0);
    
    // Add micro dig cost if required
    if (microDigRequired) {
      totalCost += microDigPrice;
    }
    
    return totalCost;
  };

  const handleSaveOnly = async () => {
    await handleSaveRequirements(false, {
      craneId: quoteData.crane_id,
      trafficControlId: quoteData.traffic_control_id,
      bobcatId: quoteData.bobcat_id,
      customRequirements,
      microDigRequired,
      microDigPrice,
      microDigNotes
    });
  };

  const handleSaveAndContinue = async () => {
    await handleSaveRequirements(true, {
      craneId: quoteData.crane_id,
      trafficControlId: quoteData.traffic_control_id,
      bobcatId: quoteData.bobcat_id,
      customRequirements,
      microDigRequired,
      microDigPrice,
      microDigNotes
    });
  };

  return (
    <div className="space-y-6">
      <FormHeader>
        Configure the required site modifications for installing this pool (non-optional items needed for installation).
      </FormHeader>
      
      {!quoteData.pool_id && <NoPoolWarning />}

      <SiteRequirementsSection
        craneId={quoteData.crane_id}
        onCraneChange={handleCraneChange}
        trafficControlId={quoteData.traffic_control_id}
        onTrafficControlChange={handleTrafficControlChange}
        bobcatId={quoteData.bobcat_id}
        onBobcatChange={handleBobcatChange}
      />
      
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

      <FormActions
        onPrevious={onPrevious}
        onSaveOnly={handleSaveOnly}
        onSaveAndContinue={handleSaveAndContinue}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
