
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuoteContext } from "../../context/QuoteContext";
import { FormHeader } from "../SiteRequirementsStep/components/FormHeader";
import { ExtraPavingSelector } from "./components/ExtraPavingSelector";
import { ConcretePumpSelector } from "./components/ConcretePumpSelector";
import { ConcreteCutsSelector } from "./components/ConcreteCutsSelector";
import { useExtraPavingQuote } from "./hooks";
import { NoPoolWarning } from "../SiteRequirementsStep/components/NoPoolWarning";
import { ConcreteCutSelection } from "./types";
import { toast } from "sonner";

interface ExtraPavingStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingStep = ({ onNext, onPrevious }: ExtraPavingStepProps) => {
  const { quoteData } = useQuoteContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPumpRequired, setIsPumpRequired] = useState(quoteData.concrete_pump_required || false);
  const [concreteCuts, setConcreteCuts] = useState<ConcreteCutSelection[]>(
    quoteData.concrete_cuts ? JSON.parse(quoteData.concrete_cuts) : []
  );
  
  const { 
    pavingSelections, 
    addSelection, 
    updateSelectionMeters, 
    removeSelection,
    totalCost: pavingTotalCost,
    totalMargin,
    saveSelections,
    addConcretePumpAndCuts
  } = useExtraPavingQuote(quoteData.id);

  // Calculate concrete cuts total cost
  const calculateConcreteCutsCost = () => {
    return concreteCuts.reduce((total, cut) => total + (cut.price * cut.quantity), 0);
  };

  // Calculate the overall total cost
  const calculateTotalCost = () => {
    let total = pavingTotalCost;
    
    // Add concrete pump cost if required
    if (isPumpRequired && quoteData.concrete_pump_price) {
      total += quoteData.concrete_pump_price;
    }
    
    // Add concrete cuts cost
    total += calculateConcreteCutsCost();
    
    return total;
  };

  const handleSaveAndContinue = async () => {
    setIsSubmitting(true);
    try {
      // First save the paving selections
      await saveSelections();
      
      // Then save the concrete pump and cuts selections
      await addConcretePumpAndCuts(isPumpRequired, concreteCuts);
      
      toast.success("Extra paving selections saved");
      onNext();
    } catch (error) {
      toast.error("Failed to save extra paving selections");
      console.error("Error saving extra paving selections:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FormHeader>
        Add additional paving and concrete requirements
      </FormHeader>
      
      {!quoteData.pool_id && <NoPoolWarning />}

      <ExtraPavingSelector
        quoteId={quoteData.id}
        selections={pavingSelections}
        onAdd={addSelection}
        onUpdate={updateSelectionMeters}
        onRemove={removeSelection}
        totalCost={pavingTotalCost}
        totalMargin={totalMargin}
      />

      <ConcretePumpSelector 
        isPumpRequired={isPumpRequired}
        onTogglePump={setIsPumpRequired}
      />

      <ConcreteCutsSelector 
        selectedCuts={concreteCuts}
        onUpdateCuts={setConcreteCuts}
      />

      {/* Total Cost Summary */}
      <div className="bg-slate-50 p-4 rounded-md">
        <h3 className="font-medium text-lg mb-2">Total Cost Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Extra Paving:</span>
            <span>${pavingTotalCost.toFixed(2)}</span>
          </div>
          
          {isPumpRequired && quoteData.concrete_pump_price && (
            <div className="flex justify-between">
              <span>Concrete Pump:</span>
              <span>${quoteData.concrete_pump_price.toFixed(2)}</span>
            </div>
          )}
          
          {concreteCuts.length > 0 && (
            <div className="flex justify-between">
              <span>Concrete Cuts:</span>
              <span>${calculateConcreteCutsCost().toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-bold border-t pt-2 mt-2">
            <span>Total:</span>
            <span>${calculateTotalCost().toFixed(2)}</span>
          </div>
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
