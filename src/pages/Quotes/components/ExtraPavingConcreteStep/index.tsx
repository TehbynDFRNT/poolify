
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { useQuoteContext } from "../../context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useConcreteCostCalculator } from "./hooks/useConcreteCostCalculator";
import { CostBreakdown } from "./components/CostBreakdown";

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

  const handleSaveAndContinue = async () => {
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
        
        // Move to next step
        onNext();
      }
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
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
                {!quoteData.pool_id && (
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-md flex items-start">
                    <AlertCircle className="text-amber-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                    <p className="text-amber-800 text-sm">
                      No pool has been selected for this quote. Some features may be limited.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Paving Selection */}
                  <div>
                    <Label htmlFor="paving-type" className="block text-gray-700 font-medium mb-1">
                      Paving Type
                    </Label>
                    <Select
                      value={selectedPavingId}
                      onValueChange={setSelectedPavingId}
                    >
                      <SelectTrigger id="paving-type" className="w-full">
                        <SelectValue placeholder="Select paving type" />
                      </SelectTrigger>
                      <SelectContent>
                        {extraPavingCosts?.map((paving) => (
                          <SelectItem key={paving.id} value={paving.id}>
                            {paving.category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Metres Input */}
                  <div>
                    <Label htmlFor="meters" className="block text-gray-700 font-medium mb-1">
                      Metres
                    </Label>
                    <Input
                      id="meters"
                      type="number"
                      min="0"
                      step="0.1"
                      value={meters || ""}
                      onChange={(e) => setMeters(parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
                  </div>
                </div>
                
                {/* Cost Breakdown */}
                {hasCostData && (
                  <CostBreakdown
                    perMeterCost={perMeterCost}
                    materialCost={materialCost}
                    labourCost={labourCost}
                    totalCost={totalCost}
                    pavingDetails={pavingDetails}
                    concreteDetails={concreteDetails}
                    labourDetails={labourDetails}
                    meters={meters}
                  />
                )}
              </div>
            )}
            
            <div className="flex justify-between mt-6">
              <Button 
                variant="outline" 
                onClick={onPrevious}
                disabled={isSubmitting}
              >
                Previous
              </Button>
              <Button 
                onClick={handleSaveAndContinue}
                disabled={isSubmitting || !hasCostData}
              >
                {isSubmitting ? "Saving..." : "Next"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
