
import { useState, useEffect } from "react";
import { useQuoteContext } from "../../context/QuoteContext";
import { FormHeader } from "../SiteRequirementsStep/components/FormHeader";
import { ExtraPavingSelector } from "./components/ExtraPavingSelector";
import { ConcretePumpSelector } from "./components/ConcretePumpSelector";
import { ConcreteCutsSelector } from "./components/ConcreteCuts"; 
import { UnderFenceConcreteStripSelector } from "./components/UnderFenceConcreteStrips";
import { useExtraPavingQuote } from "./hooks";
import { NoPoolWarning } from "../SiteRequirementsStep/components/NoPoolWarning";
import { ConcreteCutSelection, UnderFenceConcreteStripSelection } from "./types";
import { FormActions } from "../SiteRequirementsStep/components/FormActions";
import { useFormSubmission } from "./hooks/useFormSubmission";
import { TotalCostSummary } from "./components/TotalCostSummary";
import { useCostCalculation } from "./hooks/useCostCalculation";
import { fetchUnderFenceStrips } from "./services/pavingService";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { calculatePavingAndLayingCosts } from "./utils/pavingCalculations";

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
  
  // Load under fence strips data when component mounts
  useEffect(() => {
    if (quoteData.id) {
      const loadUnderFenceStrips = async () => {
        const stripsData = await fetchUnderFenceStrips(quoteData.id);
        if (stripsData && stripsData.length > 0) {
          setUnderFenceStrips(stripsData);
        }
      };
      loadUnderFenceStrips();
    }
  }, [quoteData.id]);
  
  const { 
    pavingSelections, 
    addSelection, 
    updateSelectionMeters, 
    removeSelection,
    totalCost: pavingTotalCost,
    totalMargin,
    concreteLabourCosts
  } = useExtraPavingQuote(quoteData.id);

  // Calculate paving and laying costs separately
  const { pavingTotal, layingTotal } = calculatePavingAndLayingCosts(pavingSelections, concreteLabourCosts);

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

  // Log the breakdown for debugging
  useEffect(() => {
    console.log("Paving Material Total:", pavingTotal);
    console.log("Laying Labour Total:", layingTotal);
    console.log("Combined Total:", pavingTotal + layingTotal);
    console.log("Should match pavingTotalCost:", pavingTotalCost);
  }, [pavingTotal, layingTotal, pavingTotalCost]);

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
        totalMargin={totalMargin || 0}
        concreteLabourCosts={concreteLabourCosts}
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
      
      {/* New Paving on Existing Concrete placeholder section */}
      <PavingOnExistingConcrete />

      {/* Total Cost Summary */}
      <TotalCostSummary 
        pavingTotal={pavingTotal}
        layingTotal={layingTotal}
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
