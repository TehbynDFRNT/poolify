
import { useRef } from "react";
import { useQuoteContext } from "../../../context/QuoteContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSavePavingData = () => {
  const { quoteData, updateQuoteData, refreshQuoteData } = useQuoteContext();
  // Reference to the PavingOnExistingConcrete component
  const pavingOnExistingConcreteRef = useRef<any>(null);
  
  const saveExtraPavingData = async (
    selectedPavingId: string,
    meters: number,
    costData: {
      perMeterCost: number;
      materialCost: number;
      labourCost: number;
      marginCost: number;
      totalCost: number;
      pavingDetails: any;
      concreteDetails: any;
      labourDetails: any;
    }
  ) => {
    if (!quoteData.id) return false;
    
    try {
      // Update the quote with extra paving concrete data
      const updates = {
        extra_paving_cost: costData.totalCost,
        // Store selected options as JSON in existing fields
        concrete_cuts: JSON.stringify({
          paving_id: selectedPavingId,
          meters: meters,
          per_meter_cost: costData.perMeterCost,
          material_cost: costData.materialCost,
          labour_cost: costData.labourCost,
          margin_cost: costData.marginCost,
          total_cost: costData.totalCost,
          paving_details: costData.pavingDetails,
          concrete_details: costData.concreteDetails,
          labour_details: costData.labourDetails
        })
      };

      // Save to database
      const { error } = await supabase
        .from("quotes")
        .update(updates)
        .eq("id", quoteData.id);

      if (error) {
        console.error("Error saving paving concrete data:", error);
        toast.error("Failed to save paving data");
        return false;
      }
      
      // Update local context
      updateQuoteData(updates);
      return true;
    } catch (error) {
      console.error("Error saving extra paving data:", error);
      return false;
    }
  };
  
  const saveExistingConcretePavingData = async () => {
    if (!pavingOnExistingConcreteRef.current) return true;
    
    try {
      const pavingOnExistingConcreteData = pavingOnExistingConcreteRef.current.getData();
      if (pavingOnExistingConcreteData) {
        const saveResult = await pavingOnExistingConcreteRef.current.handleSave();
        return saveResult;
      }
      return true;
    } catch (error) {
      console.error("Error saving paving on existing concrete:", error);
      return false;
    }
  };
  
  const removeExtraPaving = async () => {
    if (!quoteData.id) return false;
    
    try {
      // Clear the extra paving data
      const updates = {
        extra_paving_cost: 0,
        concrete_cuts: ""
      };
      
      const { error } = await supabase
        .from("quotes")
        .update(updates)
        .eq("id", quoteData.id);
        
      if (error) {
        console.error("Error removing extra paving data:", error);
        toast.error("Failed to remove extra paving data");
        return false;
      }
      
      // Update local context
      updateQuoteData(updates);
      
      return true;
    } catch (error) {
      console.error("Error in remove process:", error);
      toast.error("An unexpected error occurred");
      return false;
    }
  };

  return {
    pavingOnExistingConcreteRef,
    saveExtraPavingData,
    saveExistingConcretePavingData,
    removeExtraPaving,
    refreshQuoteData
  };
};
