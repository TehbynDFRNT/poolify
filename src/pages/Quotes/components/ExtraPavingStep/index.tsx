
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { FormHeader } from "../SiteRequirementsStep/components/FormHeader";
import { Card, CardContent } from "@/components/ui/card";
import { ExtraPavingCost } from "@/types/extra-paving-cost";
import { AlertCircle } from "lucide-react";

interface ExtraPavingStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingStep = ({ onNext, onPrevious }: ExtraPavingStepProps) => {
  const { quoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveAndContinue = () => {
    setIsSubmitting(true);
    // For now this is a placeholder, so we just continue
    setTimeout(() => {
      setIsSubmitting(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <FormHeader>
        Configure extra paving requirements for this pool installation.
      </FormHeader>
      
      {!quoteData.pool_id && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">No pool selected</h3>
                <p className="text-sm text-amber-700 mt-1">
                  You haven't selected a pool yet. Some calculations may not be available.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Placeholder message */}
      <div className="rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-semibold mb-2">Extra Paving Options Coming Soon</h3>
        <p className="text-muted-foreground mb-4">
          This feature is under development. Management of extra paving requirements will be
          available in a future update.
        </p>
        <p className="text-sm text-muted-foreground">
          This section will allow you to add paving options and calculate costs based on area and materials.
        </p>
      </div>

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
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};
