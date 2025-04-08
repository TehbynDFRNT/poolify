
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SiteRequirementsSection } from "./SiteRequirementsSection";
import { SiteRequirementsFormHeader } from "./SiteRequirementsFormHeader";

interface StandardRequirementsSectionProps {
  craneId: string | undefined;
  onCraneChange: (craneId: string) => void;
  trafficControlId: string | undefined;
  onTrafficControlChange: (trafficControlId: string) => void;
  bobcatId: string | undefined;
  onBobcatChange: (bobcatId: string) => void;
}

export const StandardRequirementsSection: React.FC<StandardRequirementsSectionProps> = ({
  craneId,
  onCraneChange,
  trafficControlId,
  onTrafficControlChange,
  bobcatId,
  onBobcatChange
}) => {
  return (
    <Card>
      <SiteRequirementsFormHeader title="Standard Site Requirements" />
      <CardContent>
        <SiteRequirementsSection
          craneId={craneId}
          onCraneChange={onCraneChange}
          trafficControlId={trafficControlId}
          onTrafficControlChange={onTrafficControlChange}
          bobcatId={bobcatId}
          onBobcatChange={onBobcatChange}
        />
      </CardContent>
    </Card>
  );
};
