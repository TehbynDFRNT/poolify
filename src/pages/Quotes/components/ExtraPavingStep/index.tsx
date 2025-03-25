
import { useState } from "react";
import { useQuoteContext } from "../../context/QuoteContext";
import { FormHeader } from "../SiteRequirementsStep/components/FormHeader";
import { ExtraPavingSelector } from "./components/ExtraPavingSelector";
import { ConcretePumpSelector } from "./components/ConcretePumpSelector";
import { ConcreteCutsSelector } from "./components/ConcreteCutsSelector";
import { useExtraPavingQuote } from "./hooks";
import { NoPoolWarning } from "../SiteRequirementsStep/components/NoPoolWarning";
import { ConcreteCutSelection } from "./types";
import { FormActions } from "../SiteRequirementsStep/components/FormActions";
import { useFormSubmission } from "./hooks/useFormSubmission";

interface ExtraPavingStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingStep = ({ onNext, onPrevious }: ExtraPavingStepProps) => {
  const { quoteData } = useQuoteContext();
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
    totalMargin
  } = useExtraPavingQuote(quoteData.id);

  const { isSubmitting, handleSaveExtraPaving } = useFormSubmission({ onNext });

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

  const handleSaveOnly = async () => {
    await handleSaveExtraPaving(false, {
      pavingSelections,
      pavingTotalCost,
      isPumpRequired,
      pumpPrice: quoteData.concrete_pump_price || 0,
      concreteCuts,
      concreteCutsCost: calculateConcreteCutsCost()
    });
  };

  const handleSaveAndContinue = async () => {
    await handleSaveExtraPaving(true, {
      pavingSelections,
      pavingTotalCost,
      isPumpRequired,
      pumpPrice: quoteData.concrete_pump_price || 0,
      concreteCuts,
      concreteCutsCost: calculateConcreteCutsCost()
    });
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

      {/* Navigation using FormActions component */}
      <FormActions
        onPrevious={onPrevious}
        onSaveOnly={handleSaveOnly}
        onSaveAndContinue={handleSaveAndContinue}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};
