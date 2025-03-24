
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PoolWizardProvider, usePoolWizard } from "@/contexts/pool-wizard/PoolWizardContext";
import { WizardStep } from "@/contexts/pool-wizard/types";
import BasicInfoStep from "./steps/BasicInfoStep";
import PoolCostsStep from "./steps/PoolCostsStep";
import ExcavationStep from "./steps/ExcavationStep";
import CraneStep from "./steps/CraneStep";
import FiltrationStep from "./steps/FiltrationStep";
import PricingStep from "./steps/PricingStep";
import ReviewStep from "./steps/ReviewStep";
import WizardNavigation from "./WizardNavigation";
import WizardProgress from "./WizardProgress";

// Component that renders the current step
const CurrentStepContent: React.FC = () => {
  const { currentStep } = usePoolWizard();
  
  switch (currentStep) {
    case "basic-info":
      return <BasicInfoStep />;
    case "pool-costs":
      return <PoolCostsStep />;
    case "excavation":
      return <ExcavationStep />;
    case "crane":
      return <CraneStep />;
    case "filtration":
      return <FiltrationStep />;
    case "pricing":
      return <PricingStep />;
    case "review":
      return <ReviewStep />;
    default:
      return <div>Invalid step</div>;
  }
};

// Wrapper component for the wizard
const WizardContent: React.FC = () => {
  const { currentStep, isLoading } = usePoolWizard();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-muted-foreground">Loading wizard data...</div>
      </div>
    );
  }
  
  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {getStepTitle(currentStep)}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <WizardProgress />
        <div className="mt-6">
          <CurrentStepContent />
        </div>
        <WizardNavigation />
      </CardContent>
    </Card>
  );
};

// Get title for the current step
const getStepTitle = (step: WizardStep): string => {
  switch (step) {
    case "basic-info":
      return "Step 1: Pool Information";
    case "pool-costs":
      return "Step 2: Pool Costs";
    case "excavation":
      return "Step 3: Excavation Setup";
    case "crane": 
      return "Step 4: Crane Selection";
    case "filtration":
      return "Step 5: Filtration Package";
    case "pricing":
      return "Step 6: Pricing & Margins";
    case "review":
      return "Review & Submit";
    default:
      return "Pool Creation Wizard";
  }
};

// Main component with provider
const PoolCreationWizard: React.FC = () => {
  return (
    <PoolWizardProvider>
      <WizardContent />
    </PoolWizardProvider>
  );
};

export default PoolCreationWizard;
