import { supabase } from "@/integrations/supabase/client";
import { PavingSelection, ConcreteCutSelection, UnderFenceConcreteStripSelection } from "../types";
import { toast } from "sonner";

// Fetch existing paving selections for a quote
export const fetchPavingSelections = async (quoteId: string): Promise<PavingSelection[]> => {
  try {
    const { data, error } = await supabase
      .from('quote_extra_pavings')
      .select('*, extra_paving_costs!inner(category, paver_cost, wastage_cost, margin_cost)')
      .eq('quote_id', quoteId);

    if (error) {
      console.error("Error fetching paving selections:", error);
      throw error;
    }

    // Map to PavingSelection objects
    return data.map(item => ({
      quoteId: item.quote_id,
      pavingId: item.paving_id,
      pavingCategory: item.extra_paving_costs.category,
      paverCost: item.extra_paving_costs.paver_cost,
      wastageCost: item.extra_paving_costs.wastage_cost,
      marginCost: item.extra_paving_costs.margin_cost,
      meters: item.meters || 0,
      totalCost: item.total_cost || 0
    }));
  } catch (error) {
    console.error("Error in fetchPavingSelections:", error);
    toast.error("Failed to fetch paving selections");
    return [];
  }
};

// Save paving selections for a quote
export const savePavingSelections = async (
  quoteId: string, 
  selections: PavingSelection[],
  totalCost: number
) => {
  try {
    // First, delete existing selections for this quote
    const { error: deleteError } = await supabase
      .from('quote_extra_pavings')
      .delete()
      .eq('quote_id', quoteId);

    if (deleteError) {
      console.error("Error deleting existing paving selections:", deleteError);
      throw deleteError;
    }

    // If we have selections, insert them
    if (selections.length > 0) {
      // Map selections to the format expected by the database
      const selectionsToInsert = selections.map(selection => ({
        quote_id: quoteId,
        paving_id: selection.pavingId,
        meters: selection.meters,
        total_cost: selection.totalCost
      }));

      const { error: insertError } = await supabase
        .from('quote_extra_pavings')
        .insert(selectionsToInsert);

      if (insertError) {
        console.error("Error inserting paving selections:", insertError);
        throw insertError;
      }
    }

    // Update the quote with the total extra paving cost
    const { error: updateError } = await supabase
      .from('quotes')
      .update({ extra_paving_cost: totalCost })
      .eq('id', quoteId);

    if (updateError) {
      console.error("Error updating quote with extra paving cost:", updateError);
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error("Error in savePavingSelections:", error);
    toast.error("Failed to save paving selections");
    throw error;
  }
};

// Save concrete pump, cuts, and under fence strips selections
export const saveConcretePumpAndCuts = async (
  quoteId: string,
  pumpRequired: boolean,
  pumpPrice: number,
  concreteCuts: ConcreteCutSelection[],
  cutsCost: number,
  underFenceStrips: UnderFenceConcreteStripSelection[] = [],
  underFenceStripsCost: number = 0
) => {
  try {
    console.log("Saving concrete pump and cuts:", {
      pumpRequired,
      pumpPrice,
      concreteCuts,
      cutsCost,
      underFenceStrips,
      underFenceStripsCost
    });

    // Update the quote with concrete pump, cuts, and under fence strips information
    const { error: updateError } = await supabase
      .from('quotes')
      .update({
        concrete_pump_required: pumpRequired,
        concrete_pump_price: pumpPrice,
        concrete_cuts: JSON.stringify(concreteCuts),
        concrete_cuts_cost: cutsCost,
        // Instead of storing the entire underFenceStrips object, store just the necessary information
        // to avoid possible database schema issues
        under_fence_strips_cost: underFenceStripsCost
      })
      .eq('id', quoteId);

    if (updateError) {
      console.error("Error updating quote with concrete information:", updateError);
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error("Error in saveConcretePumpAndCuts:", error);
    toast.error("Failed to save concrete pump and cuts");
    throw error;
  }
};
