
import { Button } from "@/components/ui/button";
import { OptionalAddonsStepProps } from "./types";
import { CostSummary } from "./components/CostSummary";

export const OptionalAddonsStep = ({ onNext, onPrevious }: OptionalAddonsStepProps) => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Enhance the pool installation with optional add-ons and upgrades.
      </p>
      
      {/* Placeholder message */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Optional Add-ons Coming Soon</h3>
        <p className="text-muted-foreground mb-4">
          This feature is under development. Add-ons such as pool cleaners, lighting systems, 
          heating systems, and automated covers will be available in a future update.
        </p>
        <p className="text-sm text-muted-foreground">
          The sample cost shown below is a placeholder and will be replaced with actual calculated costs.
        </p>
      </div>

      {/* Cost Summary */}
      <CostSummary totalCost={0} />

      {/* Navigation */}
      <div className="flex justify-between mt-6">
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
            onClick={onNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
