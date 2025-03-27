
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "../../context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useConcreteCostCalculator } from "./hooks/useConcreteCostCalculator";
import { CostBreakdown } from "./components/CostBreakdown";
import { PavingTypeSelector } from "./components/PavingTypeSelector";
import { MetersInput } from "./components/MetersInput";
import { NoPoolWarning } from "./components/NoPoolWarning";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";
import { ConcreteExtras } from "./components/ConcreteExtras";
import { Button } from "@/components/ui/button";
import { Save, AlertCircle } from "lucide-react";
import { usePageSaveState } from "./hooks/usePageSaveState";

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
  const [pavingOnExistingConcreteRef, setPavingOnExistingConcreteRef] = useState<{
    getData: () => any;
    hasUnsavedChanges: boolean;
  } | null>(null);
  
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
            return;
          }

          // Update local context
          updateQuoteData(updates);
        }
      }

      // Then save the paving on existing concrete data
      if (pavingOnExistingConcreteRef) {
        const pavingOnExistingConcreteData = pavingOnExistingConcreteRef.getData();
        if (pavingOnExistingConcreteData) {
          await pavingOnExistingConcreteData.save();
        }
      }
      
      // Refresh the quote data to ensure we have the latest state
      await refreshQuoteData();
      
      toast.success("All paving & concrete data saved successfully");
      markAsSaved();
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
      onNext();
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Extra Paving & Concrete</h2>
        {hasUnsavedChanges && (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1.5 px-3 py-1">
            <AlertCircle className="h-4 w-4" />
            Unsaved changes
          </Badge>
        )}
      </div>

      <Card className="border border-gray-200">
        <CardHeader className="bg-white pb-2">
          <h3 className="text-xl font-semibold">Extra Paving</h3>
          <p className="text-gray-500">Calculate additional paving costs</p>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="border-t mt-2 pt-4">
            {isLoading ? (
              <div className="py-4 text-center text-gray-500">Loading paving options...</div>
            ) : (
              <div className="space-y-6">
                {!quoteData.pool_id && <NoPoolWarning />}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Paving Selection */}
                  <PavingTypeSelector 
                    selectedPavingId={selectedPavingId}
                    extraPavingCosts={extraPavingCosts}
                    onSelect={handleSelectedPavingChange}
                  />
                  
                  {/* Metres Input */}
                  <MetersInput 
                    meters={meters} 
                    onChange={handleMetersChange} 
                  />
                </div>
                
                {/* Cost Breakdown */}
                {hasCostData && (
                  <CostBreakdown
                    perMeterCost={perMeterCost}
                    materialCost={materialCost}
                    labourCost={labourCost}
                    marginCost={marginCost}
                    totalCost={totalCost}
                    pavingDetails={pavingDetails}
                    concreteDetails={concreteDetails}
                    labourDetails={labourDetails}
                    meters={meters}
                  />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Concrete Extras component */}
      <ConcreteExtras />
      
      {/* Paving on Existing Concrete section */}
      <PavingOnExistingConcrete 
        ref={setPavingOnExistingConcreteRef}
        onChanged={markAsChanged}
      />

      {/* Centralized Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onPrevious}
          disabled={isSubmitting}
        >
          Previous
        </Button>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleSave}
            disabled={isSubmitting}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : "Save All"}
          </Button>
          <Button 
            onClick={handleSaveAndContinue}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};
