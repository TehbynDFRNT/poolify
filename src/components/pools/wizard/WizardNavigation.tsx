
import React from "react";
import { Button } from "@/components/ui/button";
import { usePoolWizard } from "@/contexts/pool-wizard/PoolWizardContext";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

const WizardNavigation: React.FC = () => {
  const { 
    currentStep, 
    previousStep, 
    nextStep, 
    form,
    isSubmitting,
    submitPool
  } = usePoolWizard();
  
  // Validate the current step before proceeding
  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      nextStep();
    }
  };
  
  const isFirstStep = currentStep === "basic-info";
  const isLastStep = currentStep === "review";
  
  return (
    <div className="flex justify-between mt-8">
      <Button
        variant="outline"
        onClick={previousStep}
        disabled={isFirstStep}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      {isLastStep ? (
        <Button 
          onClick={submitPool} 
          disabled={isSubmitting}
          className="bg-green-600 hover:bg-green-700"
        >
          <Save className="mr-2 h-4 w-4" />
          {isSubmitting ? "Saving..." : "Create Pool"}
        </Button>
      ) : (
        <Button onClick={handleNext}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;
