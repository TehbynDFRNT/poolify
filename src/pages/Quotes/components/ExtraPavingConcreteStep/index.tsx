
import React from "react";
import { useExtraPavingData } from "./hooks/useExtraPavingData";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { ConcreteExtras } from "./components/ConcreteExtras";
import { NavigationButtons } from "./components/NavigationButtons";
import { PageHeader } from "./components/PageHeader";
import { MainPavingSection } from "./components/MainPavingSection";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep = ({
  onNext,
  onPrevious,
}: ExtraPavingConcreteStepProps) => {
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
    handleSelectedPavingChange,
    handleMetersChange,
    handleSave,
    handleSaveAndContinue,
    handleRemoveExtraPaving,
    markAsChanged
  } = useExtraPavingData();

  // Modified to include onNext for the save and continue function
  const onSaveAndContinue = async () => {
    try {
      await handleSave();
      // Delay the navigation slightly to ensure state is updated
      setTimeout(() => {
        onNext();
      }, 300);
    } catch (error) {
      console.error("Error in save and continue:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page header with unsaved changes indicator */}
      <PageHeader hasUnsavedChanges={hasUnsavedChanges} />

      {/* Main Paving Section */}
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
      
      {/* Paving on Existing Concrete section */}
      <PavingOnExistingConcrete 
        ref={pavingOnExistingConcreteRef}
        onChanged={markAsChanged}
      />
      
      {/* Concrete Extras component */}
      <ConcreteExtras />

      {/* Navigation Buttons */}
      <NavigationButtons
        onPrevious={onPrevious}
        onSave={handleSave}
        onSaveAndContinue={onSaveAndContinue}
        isSubmitting={isSubmitting}
        isDisabled={false}
      />
    </div>
  );
};
