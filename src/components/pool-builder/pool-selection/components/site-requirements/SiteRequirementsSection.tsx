
import React from "react";
import { CraneSelector } from "./CraneSelector";
import { TrafficControlSelector } from "./TrafficControlSelector";
import { BobcatSelector } from "./BobcatSelector";

interface SiteRequirementsSectionProps {
  craneId: string | undefined;
  onCraneChange: (craneId: string) => void;
  trafficControlId: string | undefined;
  onTrafficControlChange: (trafficControlId: string) => void;
  bobcatId: string | undefined;
  onBobcatChange: (bobcatId: string) => void;
}

export const SiteRequirementsSection: React.FC<SiteRequirementsSectionProps> = ({
  craneId,
  onCraneChange,
  trafficControlId,
  onTrafficControlChange,
  bobcatId,
  onBobcatChange
}) => {
  return (
    <div className="space-y-6">
      {/* Each selector in its own row */}
      <CraneSelector 
        craneId={craneId} 
        onCraneChange={onCraneChange} 
      />
      
      <TrafficControlSelector 
        trafficControlId={trafficControlId} 
        onTrafficControlChange={onTrafficControlChange} 
      />
      
      <BobcatSelector
        bobcatId={bobcatId}
        onBobcatChange={onBobcatChange}
      />
    </div>
  );
};
