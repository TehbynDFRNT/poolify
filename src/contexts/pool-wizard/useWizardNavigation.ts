
import { useState } from "react";
import { WizardStep, WIZARD_STEPS } from "./types";

export const useWizardNavigation = () => {
  const [currentStep, setCurrentStep] = useState<WizardStep>("basic-info");

  // Navigate between steps
  const nextStep = () => {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep);
    if (currentIndex < WIZARD_STEPS.length - 1) {
      setCurrentStep(WIZARD_STEPS[currentIndex + 1]);
    }
  };

  const previousStep = () => {
    const currentIndex = WIZARD_STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(WIZARD_STEPS[currentIndex - 1]);
    }
  };

  return {
    currentStep,
    setCurrentStep,
    nextStep,
    previousStep
  };
};
