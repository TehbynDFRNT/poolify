
import React, { useEffect } from "react";
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
  
  // Ensure we have the latest data when the component mounts
  useEffect(() => {
    refreshQuoteData();
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

  // Handle save all sections
  const saveAllSections = async () => {
    try {
      // Save main paving section first
      await handleSave();
      
      // Save all other sections - the refreshQuoteData in handleSave above will ensure 
      // the TotalCostSummary gets updated with all the latest data
      
      toast.success("All extra paving and concrete data saved successfully");
    } catch (error) {
      console.error("Error saving all sections:", error);
      toast.error("Failed to save some sections. Please try again.");
    }
  };

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
        onSelectedPavingChange={handleSelectedPavingChange}
        onMetersChange={handleMetersChange}
        onRemove={handleRemoveExtraPaving}
        markAsChanged={markAsChanged}
      />

      {/* 2. Paving on Existing Concrete */}
      <div ref={pavingOnExistingConcreteRef}>
        <PavingOnExistingConcrete onChanged={markAsChanged} />
      </div>

      {/* 3. Extra Concreting */}
      <div ref={extraConcretingRef}>
        <ExtraConcreting onChanged={markAsChanged} />
      </div>

      {/* 4, 5, 6. Concrete Pump, Cuts, Under Fence Strips */}
      <ConcreteExtras onChanged={markAsChanged} />

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
