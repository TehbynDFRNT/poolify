
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { OptionalAddonsStepProps } from "./types";
import { useOptionalAddons } from "./hooks/useOptionalAddons";
import { StandardAddons } from "./components/StandardAddons";
import { CustomRequirements } from "./components/CustomRequirements";
import { MicroDigSection } from "./components/MicroDigSection";
import { CostSummary } from "./components/CostSummary";

export const OptionalAddonsStep = ({ onNext, onPrevious }: OptionalAddonsStepProps) => {
  const {
    addons,
    customRequirements,
    microDigRequired,
    setMicroDigRequired,
    microDigPrice,
    setMicroDigPrice,
    microDigNotes,
    setMicroDigNotes,
    isSubmitting,
    toggleAddon,
    updateQuantity,
    addCustomRequirement,
    removeCustomRequirement,
    updateCustomRequirement,
    calculateAddonsCost,
    saveAddons
  } = useOptionalAddons();

  const handleSaveOnly = async () => {
    await saveAddons();
  };

  const handleSaveAndContinue = async () => {
    await saveAddons(onNext);
  };

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enhance the pool installation with optional add-ons and upgrades.
      </p>
      
      {/* Standard Addons Section */}
      <StandardAddons 
        addons={addons}
        toggleAddon={toggleAddon}
        updateQuantity={updateQuantity}
      />
      
      {/* Custom Requirements Section */}
      <CustomRequirements 
        requirements={customRequirements}
        addRequirement={addCustomRequirement}
        removeRequirement={removeCustomRequirement}
        updateRequirement={updateCustomRequirement}
      />
      
      {/* Micro Dig Section */}
      <MicroDigSection 
        required={microDigRequired}
        setRequired={setMicroDigRequired}
        price={microDigPrice}
        setPrice={setMicroDigPrice}
        notes={microDigNotes}
        setNotes={setMicroDigNotes}
      />

      {/* Cost Summary */}
      <CostSummary totalCost={calculateAddonsCost()} />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        
        <div className="space-x-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSaveOnly}
            disabled={isSubmitting}
          >
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button 
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};
