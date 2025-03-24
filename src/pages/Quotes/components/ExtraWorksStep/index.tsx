
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQuoteContext } from "../../context/QuoteContext";
import { ExtraPavingSection } from "./components/ExtraPavingSection";
import { ExtraConcretingSection } from "./components/ExtraConcretingSection";
import { formatCurrency } from "@/utils/format";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useParams } from "react-router-dom";

interface ExtraWorksStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraWorksStep = ({ onNext, onPrevious }: ExtraWorksStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { quoteId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [totalExtraWorksCost, setTotalExtraWorksCost] = useState(quoteData.extra_works_cost || 0);

  // Update total extra works cost
  const updateTotalCost = () => {
    const pavingCost = document.querySelector('[data-paving-cost]')?.getAttribute('data-cost') || 0;
    const concretingCost = document.querySelector('[data-concreting-cost]')?.getAttribute('data-cost') || 0;
    
    const total = Number(pavingCost) + Number(concretingCost);
    setTotalExtraWorksCost(total);
    updateQuoteData({ extra_works_cost: total });
  };

  useEffect(() => {
    updateTotalCost();
  }, []);

  const handleSave = async (andContinue = false) => {
    if (!quoteId) {
      toast({
        title: "Error",
        description: "Quote ID is missing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("quotes")
        .update({
          extra_works_cost: totalExtraWorksCost
        })
        .eq("id", quoteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Extra works details saved successfully",
      });

      if (andContinue) {
        onNext();
      }
    } catch (error) {
      console.error("Error saving extra works:", error);
      toast({
        title: "Error",
        description: "Failed to save extra works details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground mb-6">
        Add extra works such as paving, concreting, retaining walls, and water features to your quote.
      </p>
      
      {/* Extra Paving Section */}
      <div data-paving-cost="0" className="mb-6">
        <ExtraPavingSection />
      </div>
      
      {/* Concrete Labour Section */}
      <div data-concreting-cost="0" className="mb-6">
        <ExtraConcretingSection />
      </div>
      
      {/* Placeholder sections for future development */}
      <div className="space-y-4 mt-8">
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
          <span className="text-lg font-bold">{formatCurrency(totalExtraWorksCost)}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          type="button" 
          variant="outline"
          onClick={onPrevious}
          disabled={isLoading}
        >
          Back
        </Button>
        
        <div className="flex gap-2">
          <Button 
            type="button"
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={isLoading}
          >
            Save
          </Button>
          
          <Button 
            type="button"
            onClick={() => handleSave(true)}
            disabled={isLoading}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </div>
  );
};
