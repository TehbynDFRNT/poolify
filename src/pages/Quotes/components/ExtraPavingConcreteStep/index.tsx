
import React from "react";
import { MainPavingSection } from "./components/MainPavingSection";
import { PageHeader } from "./components/PageHeader";
import { ConcreteExtras } from "./components/ConcreteExtras";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { ExtraConcreting } from "./components/ExtraConcreting";
import { NavigationButtons } from "./components/NavigationButtons";
import { useExtraPavingData } from "./hooks/useExtraPavingData";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep: React.FC<ExtraPavingConcreteStepProps> = ({
  onNext,
  onPrevious
}) => {
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
      <PageHeader />

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

      <div ref={pavingOnExistingConcreteRef}>
        <PavingOnExistingConcrete onChanged={markAsChanged} />
      </div>

      <ConcreteExtras onChanged={markAsChanged} />

      <div ref={extraConcretingRef}>
        <ExtraConcreting onChanged={markAsChanged} />
      </div>

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
