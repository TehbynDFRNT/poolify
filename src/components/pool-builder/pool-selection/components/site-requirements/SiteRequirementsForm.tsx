
import React from "react";
import { Pool } from "@/types/pool";
import { LoadingIndicator } from "./LoadingIndicator";
import { StandardRequirementsSection } from "./StandardRequirementsSection";
import { CustomRequirementsSection } from "./CustomRequirementsSection";
import { AdditionalNotesSection } from "./AdditionalNotesSection";
import { CostSummarySection } from "./CostSummarySection";
import { SaveButton } from "./SaveButton";
import { useSiteRequirements } from "@/hooks/useSiteRequirements";

interface SiteRequirementsFormProps {
  pool: Pool;
  customerId: string;
  onSave: (formData: any) => void;
  isSubmitting: boolean;
}

export const SiteRequirementsForm: React.FC<SiteRequirementsFormProps> = ({
  pool,
  customerId,
  onSave,
  isSubmitting
}) => {
  const {
    craneId,
    setCraneId,
    trafficControlId,
    setTrafficControlId,
    bobcatId,
    setBobcatId,
    customRequirements,
    notes,
    setNotes,
    isLoading,
    craneCost,
    trafficControlCost,
    bobcatCost,
    defaultCraneCost,
    defaultCraneId,
    isDefaultCrane,
    totalCost,
    customRequirementsTotal,
    addRequirement,
    removeRequirement,
    updateRequirement
  } = useSiteRequirements(customerId);

  const handleSaveRequirements = () => {
    onSave({
      craneId,
      trafficControlId,
      bobcatId,
      customRequirements,
      notes
    });
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6">
      {/* Standard Site Requirements Section */}
      <StandardRequirementsSection
        craneId={craneId}
        onCraneChange={setCraneId}
        trafficControlId={trafficControlId}
        onTrafficControlChange={setTrafficControlId}
        bobcatId={bobcatId}
        onBobcatChange={setBobcatId}
      />
      
      {/* Custom Site Requirements Section */}
      <CustomRequirementsSection
        requirements={customRequirements}
        addRequirement={addRequirement}
        removeRequirement={removeRequirement}
        updateRequirement={updateRequirement}
      />
      
      {/* Additional Notes Section */}
      <AdditionalNotesSection
        notes={notes}
        setNotes={setNotes}
      />
      
      {/* Cost Summary Section */}
      <CostSummarySection
        craneCost={craneCost}
        trafficControlCost={trafficControlCost}
        bobcatCost={bobcatCost}
        customRequirementsTotal={customRequirementsTotal}
        totalCost={totalCost}
        isDefaultCrane={isDefaultCrane}
        defaultCraneCost={defaultCraneCost}
      />
      
      {/* Save Button */}
      <SaveButton
        onSave={handleSaveRequirements}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
