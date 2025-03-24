
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useEffect } from "react";
import { toast } from "sonner";

interface SiteRequirementsStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SiteRequirementsStep = ({ onNext, onPrevious }: SiteRequirementsStepProps) => {
  const { quoteData } = useQuoteContext();

  useEffect(() => {
    // Check if we have a pool selected from the previous step
    if (!quoteData.pool_id) {
      toast.error("Please select a pool before configuring site requirements");
    }
  }, [quoteData.pool_id]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Configure the required site modifications for installing this pool (non-optional items needed for installation).
      </p>
      
      {/* This will be implemented with the actual site requirements form elements */}
      <div className="min-h-[200px] flex items-center justify-center border rounded-md p-6">
        <p className="text-muted-foreground">
          Site requirements form coming soon. This will include crane selection, excavation details, and other required installation elements.
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
