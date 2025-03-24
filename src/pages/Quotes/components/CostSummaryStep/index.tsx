
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface CostSummaryStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const CostSummaryStep = ({ onNext, onPrevious }: CostSummaryStepProps) => {
  const { quoteData } = useQuoteContext();

  useEffect(() => {
    // Show warning but don't block progress
    if (!quoteData.pool_id) {
      toast.warning("No pool selected. You can continue, but the quote will be incomplete.");
    }
  }, [quoteData.pool_id]);

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Review the complete cost breakdown for this quote.
      </p>
      
      {/* This will be implemented with the actual cost summary components */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Base Pool Cost</span>
              <span>$XX,XXX</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Site Requirements</span>
              <span>$X,XXX</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Optional Add-ons</span>
              <span>$X,XXX</span>
            </div>
            <div className="flex justify-between py-2 font-bold text-lg">
              <span>Total Cost</span>
              <span>$XX,XXX</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
        >
          Back
        </Button>
        <Button onClick={onNext}>
          Preview Quote
        </Button>
      </div>
    </div>
  );
};
