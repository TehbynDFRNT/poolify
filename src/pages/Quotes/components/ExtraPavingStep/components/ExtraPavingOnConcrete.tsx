
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useConcreteCosts } from "@/pages/ConstructionCosts/hooks/useConcreteCosts";
import { PavingTypeSelector } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/PavingTypeSelector";
import { MetersInput } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/MetersInput";
import { CostBreakdown } from "@/pages/Quotes/components/ExtraPavingConcreteStep/components/CostBreakdown";
import { useConcreteCostCalculator } from "@/pages/Quotes/components/ExtraPavingConcreteStep/hooks/useConcreteCostCalculator";
import { useQuoteContext } from "@/pages/Quotes/context/QuoteContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ExtraPavingOnConcreteProps {
  onCostUpdate?: (cost: number) => void;
}

export const ExtraPavingOnConcrete = ({ onCostUpdate }: ExtraPavingOnConcreteProps) => {
  const { quoteData } = useQuoteContext();
  const { concreteCosts, extraPavingCosts, concreteLabourCosts, isLoading } = useConcreteCosts();
  
  const [selectedPavingId, setSelectedPavingId] = useState<string>("");
  const [meters, setMeters] = useState<number>(0);
  const [isSaving, setIsSaving] = useState(false);

  // Load saved data when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      if (quoteData.id) {
        try {
          const { data, error } = await supabase
            .from('quote_extra_pavings')
            .select('*')
            .eq('quote_id', quoteData.id)
            .eq('type', 'extra_paving_on_concrete')
            .maybeSingle();

          if (error) throw error;
          
          if (data) {
            setSelectedPavingId(data.paving_id || "");
            setMeters(data.meters || 0);
          }
        } catch (error) {
          console.error("Error loading saved extra paving data:", error);
        }
      }
    };

    loadSavedData();
  }, [quoteData.id]);

  // Calculate costs based on selections
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

  // Update parent component when cost changes
  useEffect(() => {
    if (onCostUpdate) {
      onCostUpdate(totalCost);
    }
  }, [totalCost, onCostUpdate]);

  // Save data when selections change
  useEffect(() => {
    const saveData = async () => {
      if (!quoteData.id || !selectedPavingId || meters <= 0) return;
      
      setIsSaving(true);
      try {
        // Check if record exists
        const { data: existingData, error: checkError } = await supabase
          .from('quote_extra_pavings')
          .select('id')
          .eq('quote_id', quoteData.id)
          .eq('type', 'extra_paving_on_concrete')
          .maybeSingle();
          
        if (checkError) throw checkError;
        
        const dataToSave = {
          quote_id: quoteData.id,
          type: 'extra_paving_on_concrete',
          paving_id: selectedPavingId,
          meters,
          total_cost: totalCost,
        };
        
        if (existingData) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('quote_extra_pavings')
            .update(dataToSave)
            .eq('id', existingData.id);
            
          if (updateError) throw updateError;
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('quote_extra_pavings')
            .insert(dataToSave);
            
          if (insertError) throw insertError;
        }
      } catch (error) {
        console.error("Error saving extra paving data:", error);
      } finally {
        setIsSaving(false);
      }
    };
    
    saveData();
  }, [quoteData.id, selectedPavingId, meters, totalCost]);

  const handlePavingChange = (pavingId: string) => {
    setSelectedPavingId(pavingId);
  };

  const handleMetersChange = (value: number) => {
    setMeters(value);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Extra Paving on Concrete</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <PavingTypeSelector 
            selectedPavingId={selectedPavingId}
            extraPavingCosts={extraPavingCosts}
            onSelect={handlePavingChange}
          />
          
          <MetersInput 
            meters={meters}
            onChange={handleMetersChange}
          />
          
          {selectedPavingId && meters > 0 && (
            <CostBreakdown
              perMeterCost={perMeterCost}
              materialCost={materialCost}
              labourCost={labourCost}
              marginCost={marginCost}
              totalCost={totalCost}
              pavingDetails={pavingDetails || {}}
              concreteDetails={concreteDetails || {}}
              labourDetails={labourDetails || {}}
              meters={meters}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
