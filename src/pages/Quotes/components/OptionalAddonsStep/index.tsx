
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useEffect } from "react";
import { toast } from "sonner";

interface OptionalAddonsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const OptionalAddonsStep = ({ onNext, onPrevious }: OptionalAddonsStepProps) => {
  const { quoteData } = useQuoteContext();

  useEffect(() => {
    // Show warning but don't block progress if no pool is selected
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Enhance the pool installation with optional add-ons and upgrades.
      </p>
      
      {/* This will be implemented with the actual optional add-ons form elements */}
      <div className="min-h-[200px] flex items-center justify-center border rounded-md p-6">
        <p className="text-muted-foreground">
          Optional add-ons form coming soon. This will include extra paving, fencing, pool cleaners, additional lighting, water features, and more.
        </p>
      </div>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button onClick={onNext}>
          Continue
        </Button>
      </div>
    </div>
  );
};
