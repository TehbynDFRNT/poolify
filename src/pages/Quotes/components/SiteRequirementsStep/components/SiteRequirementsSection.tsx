
import { CraneSelector } from "./CraneSelector";
import { TrafficControlSelector } from "./TrafficControlSelector";

interface SiteRequirementsSectionProps {
  craneId: string | undefined;
  onCraneChange: (craneId: string) => void;
  trafficControlId: string | undefined;
  onTrafficControlChange: (trafficControlId: string) => void;
}

export const SiteRequirementsSection = ({
  craneId,
  onCraneChange,
  trafficControlId,
  onTrafficControlChange
}: SiteRequirementsSectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CraneSelector 
        craneId={craneId} 
        onCraneChange={onCraneChange} 
      />
      
      <TrafficControlSelector 
        trafficControlId={trafficControlId} 
        onTrafficControlChange={onTrafficControlChange} 
      />
    </div>
  );
};
