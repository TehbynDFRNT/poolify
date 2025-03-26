
import { useState, useEffect } from "react";
import { useQuoteContext } from "../../context/QuoteContext";
import { FormHeader } from "../SiteRequirementsStep/components/FormHeader";
import { ExtraPavingSelector } from "./components/ExtraPavingSelector";
import { ConcretePumpSelector } from "./components/ConcretePumpSelector";
import { ConcreteCutsSelector } from "./components/ConcreteCutsSelector";
import { UnderFenceConcreteStripSelector } from "./components/UnderFenceConcreteStripSelector";
import { useExtraPavingQuote } from "./hooks";
import { NoPoolWarning } from "../SiteRequirementsStep/components/NoPoolWarning";
import { ConcreteCutSelection, UnderFenceConcreteStripSelection } from "./types";
import { FormActions } from "../SiteRequirementsStep/components/FormActions";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { TotalCostSummary } from "./components/TotalCostSummary";
import { useCostCalculation } from "./hooks/useCostCalculation";

interface ExtraPavingStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingStep = ({ onNext, onPrevious }: ExtraPavingStepProps) => {
  const { quoteData } = useQuoteContext();
  const [isPumpRequired, setIsPumpRequired] = useState(quoteData.concrete_pump_required || false);
  const [concreteCuts, setConcreteCuts] = useState<ConcreteCutSelection[]>(() => {
    try {
      if (quoteData.concrete_cuts && quoteData.concrete_cuts.trim() !== "") {
        const parsed = JSON.parse(quoteData.concrete_cuts);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      console.error("Error parsing concrete cuts:", e);
    }
    return [];
  });
  
  const [underFenceStrips, setUnderFenceStrips] = useState<UnderFenceConcreteStripSelection[]>([]);
  
  const { 
    pavingSelections, 
    addSelection, 
    updateSelectionMeters, 
    removeSelection,
    totalCost: pavingTotalCost,
    totalMargin
  } = useExtraPavingQuote(quoteData.id);

  const { isSubmitting, handleSaveExtraPaving } = useFormSubmission({ onNext });
  
  const { 
    calculateConcreteCutsCost,
    calculateUnderFenceStripsCost,
    calculateTotalCost
  } = useCostCalculation(quoteData.concrete_pump_price || 0);

  const concreteCutsCost = calculateConcreteCutsCost(concreteCuts);
  const underFenceStripsCost = calculateUnderFenceStripsCost(underFenceStrips);
  const totalCost = calculateTotalCost(
    pavingTotalCost || 0, 
    isPumpRequired, 
    concreteCuts, 
    underFenceStrips
  );

  const handleSaveOnly = async () => {
    await handleSaveExtraPaving(false, {
      pavingSelections,
      pavingTotalCost,
      isPumpRequired,
      pumpPrice: quoteData.concrete_pump_price || 0,
      concreteCuts,
      concreteCutsCost,
      underFenceStrips,
      underFenceStripsCost
    });
  };

  const handleSaveAndContinue = async () => {
    await handleSaveExtraPaving(true, {
      pavingSelections,
      pavingTotalCost,
      isPumpRequired,
      pumpPrice: quoteData.concrete_pump_price || 0,
      concreteCuts,
      concreteCutsCost,
      underFenceStrips,
      underFenceStripsCost
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
        totalCost={pavingTotalCost || 0}
        totalMargin={totalMargin ||.0}
      />

      <ConcretePumpSelector 
        isPumpRequired={isPumpRequired}
        onTogglePump={setIsPumpRequired}
      />

      <ConcreteCutsSelector 
        selectedCuts={concreteCuts}
        onUpdateCuts={setConcreteCuts}
      />
      
      <UnderFenceConcreteStripSelector
        selectedStrips={underFenceStrips}
        onUpdateStrips={setUnderFenceStrips}
      />

      {/* Total Cost Summary */}
      <TotalCostSummary 
        pavingTotalCost={pavingTotalCost || 0}
        isPumpRequired={isPumpRequired}
        pumpPrice={quoteData.concrete_pump_price || 0}
        concreteCutsCost={concreteCutsCost}
        underFenceStripsCost={underFenceStripsCost}
        totalCost={totalCost}
      />

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
