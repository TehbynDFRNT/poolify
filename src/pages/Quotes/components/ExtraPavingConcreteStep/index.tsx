
import React, { useState, useEffect, useRef } from "react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "../../context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useConcreteCostCalculator } from "./hooks/useConcreteCostCalculator";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { ConcreteExtras } from "./components/ConcreteExtras";
import { usePageSaveState } from "./hooks/usePageSaveState";
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
  const { quoteData, updateQuoteData, refreshQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  const { hasUnsavedChanges, markAsChanged, markAsSaved } = usePageSaveState();
  
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Reference to the PavingOnExistingConcrete component
  const pavingOnExistingConcreteRef = useRef<any>(null);
  
  // Use the custom hook for cost calculations
  const { 
    perMeterCost, 
    totalCost, 
    materialCost, 
    labourCost,
    marginCost,
    pavingDetails,
    concreteDetails,
    labourDetails 
  } = useConcreteCostCalculator(
    selectedPavingId, 
    meters, 
    extraPavingCosts, 
    concreteCosts, 
    concreteLabourCosts
  );

  // Load data from quote if we're editing
  useEffect(() => {
    if (quoteData.concrete_cuts) {
      try {
        const savedData = JSON.parse(quoteData.concrete_cuts);
        if (savedData && savedData.paving_id) {
          setSelectedPavingId(savedData.paving_id);
          setMeters(savedData.meters || 0);
        }
      } catch (err) {
        console.error("Failed to parse saved paving data:", err);
      }
    }
  }, [quoteData.concrete_cuts]);

  // Mark changes when inputs change
  useEffect(() => {
    markAsChanged();
  }, [selectedPavingId, meters]);

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      let isSaveSuccessful = true;
      
      // First save the main paving data
      if (selectedPavingId && meters > 0) {
        // Update the quote with extra paving concrete data
        const updates = {
          extra_paving_cost: totalCost,
          // Store selected options as JSON in existing fields
          concrete_cuts: JSON.stringify({
            paving_id: selectedPavingId,
            meters: meters,
            per_meter_cost: perMeterCost,
            material_cost: materialCost,
            labour_cost: labourCost,
            margin_cost: marginCost,
            total_cost: totalCost,
            paving_details: pavingDetails,
            concrete_details: concreteDetails,
            labour_details: labourDetails
          })
        };

        if (quoteData.id) {
          // Save to database
          const { error } = await supabase
            .from("quotes")
            .update(updates)
            .eq("id", quoteData.id);

          if (error) {
            console.error("Error saving paving concrete data:", error);
            toast.error("Failed to save paving data");
            isSaveSuccessful = false;
          } else {
            // Update local context
            updateQuoteData(updates);
          }
        }
      }

      // Then save the paving on existing concrete data
      if (pavingOnExistingConcreteRef.current) {
        try {
          const pavingOnExistingConcreteData = pavingOnExistingConcreteRef.current.getData();
          if (pavingOnExistingConcreteData) {
            const saveResult = await pavingOnExistingConcreteRef.current.handleSave();
            if (!saveResult) {
              isSaveSuccessful = false;
            }
          }
        } catch (error) {
          console.error("Error saving paving on existing concrete:", error);
          isSaveSuccessful = false;
        }
      }
      
      // Refresh the quote data to ensure we have the latest state
      await refreshQuoteData();
      
      if (isSaveSuccessful) {
        toast.success("All paving & concrete data saved successfully");
        markAsSaved();
      } else {
        toast.error("Some data could not be saved. Please check and try again.");
      }
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred while saving");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAndContinue = async () => {
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

  const handleSelectedPavingChange = (id: string) => {
    setSelectedPavingId(id);
    markAsChanged();
  };

  const handleMetersChange = (value: number) => {
    setMeters(value);
    markAsChanged();
  };

  const isLoading = isLoadingPaving || isLoadingConcrete || isLoadingLabour;
  const hasCostData = selectedPavingId && meters > 0;

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
        onSaveAndContinue={handleSaveAndContinue}
        isSubmitting={isSubmitting}
        isDisabled={false}
      />
    </div>
  );
};
