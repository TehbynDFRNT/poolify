
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SquareDashed, Calculator, ArrowRight } from "lucide-react";
import { useExtraPavingCosts } from "@/pages/ConstructionCosts/hooks/useExtraPavingCosts";
import { useConcreteLabourCosts } from "@/pages/ConstructionCosts/hooks/useConcreteLabourCosts";
import { PavingTypeSelector } from "./PavingTypeSelector";
import { MetersInput } from "./MetersInput";
import { useQuoteContext } from "../../../context/QuoteContext";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";

export const PavingOnExistingConcrete = () => {
  const { quoteData, updateQuoteData } = useQuoteContext();
  const { extraPavingCosts, isLoading: isLoadingPaving } = useExtraPavingCosts();
  const { concreteLabourCosts, isLoading: isLoadingLabour } = useConcreteLabourCosts();
  
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cost calculations
  const [pavingCost, setPavingCost] = useState(0);
  const [labourCost, setLabourCost] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [materialCost, setMaterialCost] = useState(0);
  const [marginCost, setMarginCost] = useState(0);
  
  // Per metre cost details
  const [paverCost, setPaverCost] = useState(0);
  const [wastageCost, setWastageCost] = useState(0);
  const [marginPaverCost, setMarginPaverCost] = useState(0);
  const [labourBaseCost, setLabourBaseCost] = useState(0);
  const [labourMarginCost, setLabourMarginCost] = useState(0);
  const [perMeterRate, setPerMeterRate] = useState(0);

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
      resetAllCosts();
      return;
    }

    // Find the selected paving
    const selectedPaving = extraPavingCosts.find(p => p.id === selectedPavingId);
    if (!selectedPaving) return;
    
    // Set individual per meter costs
    setPaverCost(selectedPaving.paver_cost);
    setWastageCost(selectedPaving.wastage_cost);
    setMarginPaverCost(selectedPaving.margin_cost);
    
    // Calculate labour costs
    let totalLabourBase = 0;
    let totalLabourMargin = 0;
    
    concreteLabourCosts.forEach(labour => {
      totalLabourBase += labour.cost;
      totalLabourMargin += labour.margin;
    });
    
    setLabourBaseCost(totalLabourBase);
    setLabourMarginCost(totalLabourMargin);
    
    // Calculate per meter rate (NO concrete costs since it's existing concrete)
    const perMeterTotal = selectedPaving.paver_cost + 
                          selectedPaving.wastage_cost + 
                          selectedPaving.margin_cost +
                          totalLabourBase +
                          totalLabourMargin;
    
    setPerMeterRate(perMeterTotal);
    
    // Calculate total costs
    const totalMaterialCost = (selectedPaving.paver_cost + 
                              selectedPaving.wastage_cost) * meters;
    
    const totalLabourCost = totalLabourBase * meters;
    const totalMarginCost = (selectedPaving.margin_cost + totalLabourMargin) * meters;
    const calculatedTotalCost = totalMaterialCost + totalLabourCost + totalMarginCost;
    
    // Update state
    setMaterialCost(totalMaterialCost);
    setLabourCost(totalLabourCost);
    setMarginCost(totalMarginCost);
    setPavingCost(totalMaterialCost);
    setTotalCost(calculatedTotalCost);
    
    // Auto-save when values change
    if (selectedPavingId && meters > 0) {
      handleSave();
    }
    
  }, [selectedPavingId, meters, extraPavingCosts, concreteLabourCosts]);

  const resetAllCosts = () => {
    setPavingCost(0);
    setLabourCost(0);
    setTotalCost(0);
    setMaterialCost(0);
    setMarginCost(0);
    setPaverCost(0);
    setWastageCost(0);
    setMarginPaverCost(0);
    setLabourBaseCost(0);
    setLabourMarginCost(0);
    setPerMeterRate(0);
  };

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
        material_cost: materialCost,
        labour_cost: labourCost,
        margin_cost: marginCost,
        total_cost: totalCost,
        per_meter_rate: perMeterRate,
        paving_details: {
          paverCost: selectedPaving.paver_cost,
          wastageCost: selectedPaving.wastage_cost,
          marginCost: selectedPaving.margin_cost
        },
        labour_details: {
          baseCost: labourBaseCost,
          marginCost: labourMarginCost
        }
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
      }
    } catch (error) {
      console.error("Error in save process:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = isLoadingPaving || isLoadingLabour;
  const hasCostData = selectedPavingId && meters > 0;

  return (
    <Card className="border border-gray-200">
      <CardHeader className="bg-white py-4 px-5 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <SquareDashed className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium">Paving on Existing Concrete</h3>
        </div>
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
              <div className="bg-gray-50 p-5 rounded-md border border-gray-200">
                <div className="flex items-center mb-4">
                  <Calculator className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Cost Breakdown</h3>
                </div>
                
                {/* Per Metre Calculation */}
                <div className="mb-4 border-b pb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Per Metre Calculation</h4>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Paver Cost:</span>
                      <span className="font-medium">${paverCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Wastage Cost:</span>
                      <span className="font-medium">${wastageCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Margin Cost:</span>
                      <span className="font-medium">${marginPaverCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Labour Base Cost:</span>
                      <span className="font-medium">${labourBaseCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Labour Margin:</span>
                      <span className="font-medium">${labourMarginCost.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-2 font-semibold">
                    <span>Per Metre Rate:</span>
                    <span>${perMeterRate.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Total Project Cost */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Total Project Cost</h4>
                  
                  <div className="flex items-center justify-center space-x-2 mb-3 bg-gray-100 p-3 rounded-md">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Per Metre</div>
                      <div className="font-medium">${perMeterRate.toFixed(2)}</div>
                    </div>
                    <div className="text-gray-400">×</div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Metres</div>
                      <div className="font-medium">{meters}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Total Cost</div>
                      <div className="font-bold">${totalCost.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
                
                {/* Cost Category Breakdown */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Material Cost:</span>
                    <span className="font-medium">${materialCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Labour Cost:</span>
                    <span className="font-medium">${labourCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Margin:</span>
                    <span className="font-medium">${marginCost.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                    <span>Total Cost:</span>
                    <span>${totalCost.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
