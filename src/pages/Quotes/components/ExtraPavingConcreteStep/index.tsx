
import { useState, useEffect } from "react";
import { PavingOnExistingConcrete } from "../ExtraPavingStep/components/PavingOnExistingConcrete";
import { ExtraPavingOnConcrete } from "../ExtraPavingStep/components/ExtraPavingOnConcrete";
import { CombinedPricingSummary } from "./components/CombinedPricingSummary";
import { NavigationButtons } from "./components/NavigationButtons";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep = ({ onNext, onPrevious }: ExtraPavingConcreteStepProps) => {
  const [extraPavingOnConcreteCost, setExtraPavingOnConcreteCost] = useState(0);
  const [pavingOnExistingConcreteCost, setPavingOnExistingConcreteCost] = useState(0);

  const handleExtraPavingOnConcreteCostUpdate = (cost: number) => {
    setExtraPavingOnConcreteCost(cost);
  };

  const handlePavingOnExistingConcreteCostUpdate = (cost: number) => {
    setPavingOnExistingConcreteCost(cost);
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
      
      <NavigationButtons 
        onPrevious={onPrevious}
        onNext={onNext}
      />
    </div>
  );
};
