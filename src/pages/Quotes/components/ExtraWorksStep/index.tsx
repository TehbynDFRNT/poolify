
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuoteContext } from "../../context/QuoteContext";
import { ExtraPavingSection } from "./components/ExtraPavingSection";
import { formatCurrency } from "@/utils/format";

interface ExtraWorksStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraWorksStep = ({ onNext, onPrevious }: ExtraWorksStepProps) => {
  const { quoteData } = useQuoteContext();
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Add extra works such as paving, concreting, retaining walls, and water features to your quote.
      </p>
      
      {/* Extra Paving Section */}
      <ExtraPavingSection />
      
      {/* Placeholder sections for future development */}
      <div className="space-y-4 mt-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Extra Concreting</h3>
            <p className="text-muted-foreground mb-4">
              Additional concreting work for the pool installation.
            </p>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-muted-foreground">
                Extra concreting options will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Retaining Walls</h3>
            <p className="text-muted-foreground mb-4">
              Retaining wall options for your pool installation.
            </p>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-muted-foreground">
                Retaining wall options will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-2">Water Features</h3>
            <p className="text-muted-foreground mb-4">
              Enhance your pool with water features and decorative elements.
            </p>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-muted-foreground">
                Water feature options will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Summary */}
      <div className="bg-muted/50 p-4 rounded-md border mt-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">Total Extra Works Cost:</span>
          <span className="text-lg font-bold">{formatCurrency(quoteData.extra_works_cost || 0)}</span>
        </div>
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
        
        <Button 
          type="button"
          onClick={onNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
