
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashed, Trash2 } from "lucide-react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { PavingTypeSelector } from "@/pages/Quotes/components/ExtraPavingStep/components/PavingTypeSelector";
import { MetersInput } from "@/pages/Quotes/components/ExtraPavingStep/components/MetersInput";
import { useQuoteContext } from "../../../context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";
import { Button } from "@/components/ui/button";

export const PavingOnExistingConcrete = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cost calculations
  const [pavingCost, setPavingCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);

  // Load existing data if available
  useEffect(() => {
    if (quoteData.existing_concrete_paving) {
      try {
        const savedData = JSON.parse(quoteData.existing_concrete_paving);
        if (savedData && savedData.paving_id) {
          setSelectedPavingId(savedData.paving_id);
          setMeters(savedData.meters || 0);
        }
      } catch (err) {
        console.error("Failed to parse saved existing concrete paving data:", err);
      }
    }
  }, [quoteData.existing_concrete_paving]);

  // Calculate costs when inputs change
  useEffect(() => {
    if (!selectedPavingId || meters <= 0 || !extraPavingCosts || !concreteLabourCosts) {
      setPavingCost(0);
      setLabourCost(0);
      setTotalCost(0);
      return;
    }

    // Find the selected paving
    const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
    if (!selectedPaving) return;

    // Calculate paving cost (paver + wastage + margin)
    const perMeterPavingCost = selectedPaving.paver_cost + selectedPaving.wastage_cost + selectedPaving.margin_cost;
    const totalPavingCost = perMeterPavingCost * meters;
    setPavingCost(totalPavingCost);

    // Calculate labour cost
    const labourRatePerMeter = concreteLabourCosts.reduce((total, cost) => total + cost.cost + cost.margin, 0);
    const totalLabourCost = labourRatePerMeter * meters;
    setLabourCost(totalLabourCost);

    // Calculate total cost
    setTotalCost(totalPavingCost + totalLabourCost);

  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts]);

  const handleSave = async () => {
    if (!selectedPavingId || meters <= 0) {
      // Don't show error if nothing is selected - this is optional
      return;
    }

    setIsSubmitting(true);

    try {
      // Find the selected paving for details
      const selectedPaving = extraPavingCosts?.find(p => p.id === selectedPavingId);
      if (!selectedPaving) {
        toast.error("Selected paving type not found");
        return;
      }

      // Get labour details
      const labourDetails = concreteLabourCosts?.map(l => ({
        description: l.description,
        cost: l.cost,
        margin: l.margin
      }));

      // Prepare the data to save
      const pavingData = {
        paving_id: selectedPavingId,
        paving_category: selectedPaving.category,
        meters: meters,
        paving_cost: pavingCost,
        labour_cost: labourCost,
        total_cost: totalCost,
        paving_details: {
          paverCost: selectedPaving.paver_cost,
          wastageCost: selectedPaving.wastage_cost,
          marginCost: selectedPaving.margin_cost
        },
        labour_details: labourDetails
      };

      if (quoteData.id) {
        const updates: Partial<Quote> = {
          existing_concrete_paving: JSON.stringify(pavingData),
          existing_concrete_paving_cost: totalCost
        };

        // Save to database
        const { error } = await supabase
          .from("quotes")
          .update(updates)
          .eq("id", quoteData.id);

        if (error) {
          console.error("Error saving existing concrete paving data:", error);
          toast.error("Failed to save data");
          return;
        }

        // Update local context
        updateQuoteData(updates);
        toast.success("Paving on existing concrete data saved");
      }
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // New delete handler
  const handleDelete = async () => {
    if (!quoteData.id) return;
    
    setIsDeleting(true);
    
    try {
      // Prepare the update to clear the data
      const updates: Partial<Quote> = {
        existing_concrete_paving: null,
        existing_concrete_paving_cost: 0
      };
      
      // Update database
      const { error } = await supabase
        .from("quotes")
        .update(updates)
        .eq("id", quoteData.id);
        
      if (error) {
        console.error("Error deleting existing concrete paving data:", error);
        toast.error("Failed to delete data");
        return;
      }
      
      // Update local state
      setSelectedPavingId("");
      setMeters(0);
      setPavingCost(0);
      setLabourCost(0);
      setTotalCost(0);
      
      // Update local context
      updateQuoteData(updates);
      toast.success("Paving on existing concrete data removed");
      
    } catch (error) {
      console.error("Error in delete process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = isLoadingPaving || isLoadingLabour;
  const hasCostData = selectedPavingId && meters > 0;
  const hasExistingData = !!quoteData.existing_concrete_paving;

  return (
    <Card className="border border-gray-200 mt-6">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <SquareDashed className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Paving on Existing Concrete</h3>
        </div>
        
        {hasExistingData && (
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" /> 
            {isDeleting ? "Removing..." : "Remove"}
          </Button>
        )}
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="py-4 text-center text-gray-500">Loading paving options...</div>
        ) : (
          <div className="space-y-6">
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
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                <h4 className="font-medium mb-2">Cost Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Paving Total:</span>
                    <span className="font-medium">${pavingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Labour Total:</span>
                    <span className="font-medium">${labourCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="font-medium">Total Cost:</span>
                    <span className="font-bold text-blue-600">${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Save and Delete Buttons */}
            {hasCostData && (
              <div className="flex justify-end">
                <Button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  variant="default"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
