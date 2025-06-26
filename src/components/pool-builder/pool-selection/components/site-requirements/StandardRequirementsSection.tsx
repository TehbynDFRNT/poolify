
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SiteRequirementsSection } from "./SiteRequirementsSection";
import { SiteRequirementsFormHeader } from "./SiteRequirementsFormHeader";
import { SiteConditionsSelector } from "./SiteConditionsSelector";
import { Separator } from "@/components/ui/separator";
import { EarthConcreteRemovalsSelector } from "./EarthConcreteRemovalsSelector";

interface StandardRequirementsSectionProps {
  craneId: string | undefined;
  onCraneChange: (craneId: string) => void;
  trafficControlId: string | undefined;
  onTrafficControlChange: (trafficControlId: string) => void;
  bobcatId: string | undefined;
  onBobcatChange: (bobcatId: string) => void;
  // Site conditions
  accessGrade: string | undefined;
  onAccessGradeChange: (value: string) => void;
  distanceFromTruck: string | undefined;
  onDistanceFromTruckChange: (value: string) => void;
  poolShellDelivery: string | undefined;
  onPoolShellDeliveryChange: (value: string) => void;
  sewerDiversion: string | undefined;
  onSewerDiversionChange: (value: string) => void;
  stormwaterDiversion: string | undefined;
  onStormwaterDiversionChange: (value: string) => void;
  removeSlab: string | undefined;
  onRemoveSlabChange: (value: string) => void;
  earthmoving: string | undefined;
  onEarthmovingChange: (value: string) => void;
  removeSlabSqm: string;
  onRemoveSlabSqmChange: (value: string) => void;
  earthmovingCubicMeters: string;
  onEarthmovingCubicMetersChange: (value: string) => void;
  onAutoAddRequirement?: (requirement: {
    description: string;
    cost: number;
    margin: number;
  }) => void;
}

export const StandardRequirementsSection: React.FC<StandardRequirementsSectionProps> = ({
  craneId,
  onCraneChange,
  trafficControlId,
  onTrafficControlChange,
  bobcatId,
  onBobcatChange,
  accessGrade,
  onAccessGradeChange,
  distanceFromTruck,
  onDistanceFromTruckChange,
  poolShellDelivery,
  onPoolShellDeliveryChange,
  sewerDiversion,
  onSewerDiversionChange,
  stormwaterDiversion,
  onStormwaterDiversionChange,
  removeSlab,
  onRemoveSlabChange,
  earthmoving,
  onEarthmovingChange,
  removeSlabSqm,
  onRemoveSlabSqmChange,
  earthmovingCubicMeters,
  onEarthmovingCubicMetersChange,
  onAutoAddRequirement
}) => {
  return (
    <Card>
      <SiteRequirementsFormHeader title="Standard Site Requirements" />
      <CardContent>
        <div className="space-y-8">
          {/* Site Conditions at the top */}
          <SiteConditionsSelector
            accessGrade={accessGrade}
            onAccessGradeChange={onAccessGradeChange}
            distanceFromTruck={distanceFromTruck}
            onDistanceFromTruckChange={onDistanceFromTruckChange}
            poolShellDelivery={poolShellDelivery}
            onPoolShellDeliveryChange={onPoolShellDeliveryChange}
            sewerDiversion={sewerDiversion}
            onSewerDiversionChange={onSewerDiversionChange}
            stormwaterDiversion={stormwaterDiversion}
            onStormwaterDiversionChange={onStormwaterDiversionChange}
            onAutoAddRequirement={onAutoAddRequirement}
          />
          
          {/* Divider */}
          <Separator className="my-6" />
          
          {/* Earth & Concrete Removals Section */}
          <EarthConcreteRemovalsSelector
            removeSlab={removeSlab}
            onRemoveSlabChange={onRemoveSlabChange}
            earthmoving={earthmoving}
            onEarthmovingChange={onEarthmovingChange}
            removeSlabSqm={removeSlabSqm}
            onRemoveSlabSqmChange={onRemoveSlabSqmChange}
            earthmovingCubicMeters={earthmovingCubicMeters}
            onEarthmovingCubicMetersChange={onEarthmovingCubicMetersChange}
            onAutoAddRequirement={onAutoAddRequirement}
          />
          
          {/* Divider */}
          <Separator className="my-6" />
          
          {/* Equipment Requirements Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Equipment Requirements</h3>
            <SiteRequirementsSection
              craneId={craneId}
              onCraneChange={onCraneChange}
              trafficControlId={trafficControlId}
              onTrafficControlChange={onTrafficControlChange}
              bobcatId={bobcatId}
              onBobcatChange={onBobcatChange}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
