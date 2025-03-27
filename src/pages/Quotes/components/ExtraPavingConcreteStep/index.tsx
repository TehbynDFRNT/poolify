
import React from "react";
import { useExtraPavingData } from "./hooks/useExtraPavingData";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { ConcreteExtras } from "./components/ConcreteExtras";
import { NavigationButtons } from "./components/NavigationButtons";
import { PageHeader } from "./components/PageHeader";
import { MainPavingSection } from "./components/MainPavingSection";
import { ExtraConcreting } from "./components/ExtraConcreting";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep = ({
  onNext,
  onPrevious,
}: ExtraPavingConcreteStepProps) => {
  // Pass onNext to the hook
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

  return (
    <div className="space-y-6">
      {/* Page header with unsaved changes indicator */}
      <PageHeader hasUnsavedChanges={hasUnsavedChanges} />

      {/* 1. Main Paving Section (Extra Paving) */}
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
        onSelectedPavingChange={handleSelectedPavingChange}
        onMetersChange={handleMetersChange}
        onRemove={handleRemoveExtraPaving}
        markAsChanged={markAsChanged}
      />
      
      {/* 2. Paving on Existing Concrete section */}
      <PavingOnExistingConcrete 
        ref={pavingOnExistingConcreteRef}
        onChanged={markAsChanged}
      />

      {/* 3. Extra Concreting section */}
      <ExtraConcreting 
        ref={extraConcretingRef}
        onChanged={markAsChanged} 
      />
      
      {/* 4-6. Concrete Extras component (contains Concrete Pump, Concrete Cuts, and Under Fence Concrete Strips) */}
      <ConcreteExtras onChanged={markAsChanged} />
      
      {/* Navigation Buttons */}
      <NavigationButtons
        onPrevious={onPrevious}
        onSave={handleSave}
        onSaveAndContinue={handleSaveAndContinue}
        isSubmitting={isSubmitting}
        isDisabled={false}
      />
    </div>
  );
};
