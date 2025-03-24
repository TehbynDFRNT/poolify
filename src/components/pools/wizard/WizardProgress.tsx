
import React from "react";
import { usePoolWizard, WizardStep } from "@/contexts/pool-wizard/PoolWizardContext";
import { Check, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

const steps: { id: WizardStep; label: string }[] = [
  { id: "basic-info", label: "Info" },
  { id: "pool-costs", label: "Costs" },
  { id: "excavation", label: "Excavation" },
  { id: "crane", label: "Crane" },
  { id: "filtration", label: "Filtration" },
  { id: "pricing", label: "Pricing" },
  { id: "review", label: "Review" },
];

const WizardProgress: React.FC = () => {
  const { currentStep, setCurrentStep } = usePoolWizard();
  
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="w-full mt-2">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.id;
          const isCompleted = index < currentIndex;
          
          return (
            <React.Fragment key={step.id}>
              <div 
                className={cn(
                  "flex flex-col items-center cursor-pointer", 
                  (isActive || isCompleted) ? "text-primary" : "text-muted-foreground"
                )}
                onClick={() => setCurrentStep(step.id)}
              >
                <div 
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full border-2",
                    isActive 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : isCompleted 
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <CircleDashed className="h-4 w-4" />
                  )}
                </div>
                <span className="text-xs mt-1">{step.label}</span>
              </div>
              
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-[2px]", 
                    index < currentIndex ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default WizardProgress;
