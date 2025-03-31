
import { useState, useEffect } from "react";
import { PavingOnExistingConcrete } from "../ExtraPavingStep/components/PavingOnExistingConcrete";
import { ExtraPavingOnConcrete } from "../ExtraPavingStep/components/ExtraPavingOnConcrete";
import { CombinedPricingSummary } from "./components/CombinedPricingSummary";
import { Button } from "@/components/ui/button";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep = ({ onNext, onPrevious }: ExtraPavingConcreteStepProps) => {
  const [extraPavingOnConcreteCost, setExtraPavingOnConcreteCost] = useState(0);
  const [pavingOnExistingConcreteCost, setPavingOnExistingConcreteCost] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleExtraPavingOnConcreteCostUpdate = (cost: number) => {
    setExtraPavingOnConcreteCost(cost);
  };

  const handlePavingOnExistingConcreteCostUpdate = (cost: number) => {
    setPavingOnExistingConcreteCost(cost);
  };

  const handleSave = () => {
    setIsSubmitting(true);
    // Save logic would go here
    setTimeout(() => setIsSubmitting(false), 500);
  };

  const handleSaveAndContinue = () => {
    setIsSubmitting(true);
    // Save logic would go here
    setTimeout(() => {
      setIsSubmitting(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="text-xl font-semibold">Extra Paving and Concrete</div>
      
      <ExtraPavingOnConcrete 
        onCostUpdate={handleExtraPavingOnConcreteCostUpdate} 
      />
      
      <PavingOnExistingConcrete 
        onCostUpdate={handlePavingOnExistingConcreteCostUpdate} 
      />
      
      <CombinedPricingSummary 
        extraPavingOnConcreteCost={extraPavingOnConcreteCost}
        pavingOnExistingConcreteCost={pavingOnExistingConcreteCost}
      />
      
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
          <Button 
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};
