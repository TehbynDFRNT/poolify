import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
import { NavigationButtons } from "./components/NavigationButtons";
import { PavingOnExistingConcrete } from "./components/PavingOnExistingConcrete";

interface ExtraPavingConcreteStepProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ExtraPavingConcreteStep = ({
  onNext,
  onPrevious,
}: ExtraPavingConcreteStepProps) => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteCosts, isLoading: isLoadingConcrete } = useConcreteCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const handleSave = async () => {
    if (!selectedPavingId || meters <= 0) {
      toast.error("Please select a paving type and enter meters");
      return;
    }

    setIsSubmitting(true);

    try {
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
          margin_cost: marginCost,  // Add margin cost to stored data
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
        toast.success("Paving & concrete data saved");
      }
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
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

  const isLoading = isLoadingPaving || isLoadingConcrete || isLoadingLabour;
  const hasCostData = selectedPavingId && meters > 0;

  return (
    <div>
      <Card className="border border-gray-200">
        <CardHeader className="bg-white pb-2">
          <h2 className="text-xl font-semibold">Extra Paving & Concrete</h2>
          <p className="text-gray-500">Calculate additional paving and concrete costs</p>
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
                    onSelect={setSelectedPavingId}
                  />
                  
                  {/* Metres Input */}
                  <MetersInput 
                    meters={meters} 
                    onChange={setMeters} 
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
            
            <NavigationButtons 
              onPrevious={onPrevious}
              onSave={handleSave}
              onSaveAndContinue={handleSaveAndContinue}
              isSubmitting={isSubmitting}
              isDisabled={!hasCostData}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Paving on Existing Concrete section */}
      <PavingOnExistingConcrete />
    </div>
  );
};
