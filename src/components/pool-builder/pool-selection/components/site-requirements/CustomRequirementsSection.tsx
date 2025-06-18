
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CustomSiteRequirements } from "./CustomSiteRequirements";
import { SiteRequirementsFormHeader } from "./SiteRequirementsFormHeader";
import { CustomRequirement } from "@/hooks/useSiteRequirements";

interface CustomRequirementsSectionProps {
  requirements: CustomRequirement[];
  addRequirement: () => void;
  removeRequirement: (id: string) => void;
  updateRequirement: (id: string, field: 'description' | 'cost' | 'margin', value: string) => void;
}

export const CustomRequirementsSection: React.FC<CustomRequirementsSectionProps> = ({
  requirements,
  addRequirement,
  removeRequirement,
  updateRequirement
}) => {
  return (
    <Card>
      <SiteRequirementsFormHeader title="Custom Requirements" />
      <CardContent>
        <CustomSiteRequirements
          requirements={requirements}
          addRequirement={addRequirement}
          removeRequirement={removeRequirement}
          updateRequirement={updateRequirement}
        />
      </CardContent>
    </Card>
  );
};
