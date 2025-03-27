
import React, { useEffect, useCallback, useRef } from "react";
import { MainPavingSection } from "./components/MainPavingSection";
import { PageHeader } from "./components/PageHeader";
import { ConcreteExtras } from "./components/ConcreteExtras";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { ExtraConcreting } from "./components/ExtraConcreting";
import { NavigationButtons } from "./components/NavigationButtons";
import { TotalCostSummary } from "./components/TotalCostSummary";
import { useExtraPavingData } from "./hooks/useExtraPavingData";
import { toast } from "sonner";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep: React.FC<ExtraPavingConcreteStepProps> = ({
  onNext,
  onPrevious
}) => {
  const { refreshQuoteData } = useQuoteContext();
  const initialLoadDone = useRef(false);
  
  // Fetch data only once when the component mounts
  useEffect(() => {
    if (!initialLoadDone.current) {
      refreshQuoteData().then(() => {
        initialLoadDone.current = true;
      });
    }
  }, [refreshQuoteData]);
  
  const {
    quoteData,
    extraPavingCosts,
    isLoading,
    selectedPavingId,
    meters,
    hasCostData,
    isSubmitting,
    perMeterCost,
    materialCost,
    labourCost,
    marginCost,
    totalCost,
    pavingDetails,
    concreteDetails,
    labourDetails,
    hasUnsavedChanges,
    pavingOnExistingConcreteRef,
    extraConcretingRef,
    handleSelectedPavingChange,
    handleMetersChange,
    handleSave,
    handleSaveAndContinue,
    handleRemoveExtraPaving,
    markAsChanged
  } = useExtraPavingData(onNext);

  // Memoize callbacks to prevent recreation on renders
  const handlePavingChange = useCallback((id: string) => {
    handleSelectedPavingChange(id);
  }, [handleSelectedPavingChange]);

  const handleMeterChange = useCallback((value: number) => {
    handleMetersChange(value);
  }, [handleMetersChange]);

  const handleContentChanged = useCallback(() => {
    markAsChanged();
  }, [markAsChanged]);

  // Handle save all sections
  const saveAllSections = useCallback(async () => {
    try {
      // Save main paving section first
      await handleSave();
      toast.success("All extra paving and concrete data saved successfully");
    } catch (error) {
      console.error("Error saving all sections:", error);
      toast.error("Failed to save some sections. Please try again.");
    }
  }, [handleSave]);

  return (
    <div className="space-y-6">
      <PageHeader hasUnsavedChanges={hasUnsavedChanges} />

      {/* 1. Extra Paving */}
      <MainPavingSection
        quoteData={quoteData}
        selectedPavingId={selectedPavingId}
        meters={meters}
        hasCostData={hasCostData}
        isLoading={isLoading}
        extraPavingCosts={extraPavingCosts}
        perMeterCost={perMeterCost}
        materialCost={materialCost}
        labourCost={labourCost}
        marginCost={marginCost}
        totalCost={totalCost}
        pavingDetails={pavingDetails}
        concreteDetails={concreteDetails}
        labourDetails={labourDetails}
        onSelectedPavingChange={handlePavingChange}
        onMetersChange={handleMeterChange}
        onRemove={handleRemoveExtraPaving}
        markAsChanged={handleContentChanged}
      />

      {/* 2. Paving on Existing Concrete */}
      <div ref={pavingOnExistingConcreteRef}>
        <PavingOnExistingConcrete onChanged={handleContentChanged} />
      </div>

      {/* 3. Extra Concreting */}
      <div ref={extraConcretingRef}>
        <ExtraConcreting onChanged={handleContentChanged} />
      </div>

      {/* 4, 5, 6. Concrete Pump, Cuts, Under Fence Strips */}
      <ConcreteExtras onChanged={handleContentChanged} />

      {/* Cost Summary - added just above the navigation buttons */}
      <TotalCostSummary />

      {/* Only one set of navigation buttons at the bottom of the page */}
      <NavigationButtons
        onPrevious={onPrevious}
        onSave={saveAllSections}
        onSaveAndContinue={handleSaveAndContinue}
        isSubmitting={isSubmitting}
        isDisabled={false}
      />
    </div>
  );
};
