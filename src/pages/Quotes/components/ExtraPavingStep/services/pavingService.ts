
import { supabase } from "@/integrations/supabase/client";
import { PavingSelection } from "../types";
import { toast } from "sonner";

// Fetch existing selections for a quote
export const fetchPavingSelections = async (quoteId: string): Promise<PavingSelection[]> => {
  try {
    // First get the selections
    const { data: selectionsData, error: selectionsError } = await supabase
      .from("quote_extra_pavings")
      .select("*")
      .eq("quote_id", quoteId);

    if (selectionsError) {
      throw selectionsError;
    }

    if (!selectionsData?.length) {
      return [];
    }

    // Then get the extra paving cost details for each selection
    const selectionPromises = selectionsData.map(async (selection) => {
      const { data: pavingData, error: pavingError } = await supabase
        .from("extra_paving_costs")
        .select("*")
        .eq("id", selection.paving_id)
        .single();

      if (pavingError) {
        console.error("Error fetching paving details:", pavingError);
        return null;
      }

      return {
        id: selection.id,
        quoteId: selection.quote_id,
        pavingId: selection.paving_id,
        pavingCategory: pavingData.category,
        paverCost: pavingData.paver_cost,
        wastageCost: pavingData.wastage_cost,
        marginCost: pavingData.margin_cost,
        meters: selection.meters,
        totalCost: selection.total_cost
      };
    });

    const resolvedSelections = await Promise.all(selectionPromises);
    return resolvedSelections.filter(Boolean) as PavingSelection[];
    
  } catch (error) {
    console.error("Error fetching extra paving selections:", error);
    toast.error("Failed to load extra paving data");
    return [];
  }
};

// Save selections to the database
export const savePavingSelections = async (
  quoteId: string, 
  selections: PavingSelection[], 
  totalCost: number
): Promise<boolean> => {
  try {
    // First, delete any existing selections
    const { error: deleteError } = await supabase
      .from("quote_extra_pavings")
      .delete()
      .eq("quote_id", quoteId);

    if (deleteError) throw deleteError;

    // Insert new selections if there are any
    if (selections.length > 0) {
      const selectionsToInsert = selections.map(selection => ({
        quote_id: quoteId,
        paving_id: selection.pavingId,
        meters: selection.meters,
        total_cost: selection.totalCost
      }));

      const { error: insertError } = await supabase
        .from("quote_extra_pavings")
        .insert(selectionsToInsert);

      if (insertError) throw insertError;
    }

    // Update the total cost in the quote
    const { error: updateError } = await supabase
      .from("quotes")
      .update({ extra_paving_cost: totalCost })
      .eq("id", quoteId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error("Error saving paving selections:", error);
    throw error;
  }
};
