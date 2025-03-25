
import { supabase } from "@/integrations/supabase/client";
import { CustomSiteRequirement } from "../types";
import { toast } from "sonner";

interface SaveRequirementsParams {
  quoteId: string;
  craneId: string | null;
  trafficControlId: string;
  customRequirements: CustomSiteRequirement[];
  microDigRequired: boolean;
  microDigPrice: number;
  microDigNotes: string;
}

export const saveRequirements = async ({
  quoteId,
  craneId,
  trafficControlId,
  customRequirements,
  microDigRequired,
  microDigPrice,
  microDigNotes
}: SaveRequirementsParams): Promise<{ success: boolean; totalCost: number }> => {
  if (!quoteId) {
    toast.error("No quote ID found. Please complete the previous steps first.");
    return { success: false, totalCost: 0 };
  }
  
  try {
    // Calculate total cost including custom requirements and micro dig
    let totalCost = 0;
    
    // Add custom requirements costs
    totalCost += customRequirements.reduce((sum, req) => sum + (req.price || 0), 0);
    
    // Add micro dig cost if required
    if (microDigRequired) {
      totalCost += microDigPrice;
    }
    
    // Data to save to database
    const dataToSave = {
      crane_id: craneId,
      traffic_control_id: trafficControlId || 'none',
      site_requirements_cost: totalCost,
      micro_dig_required: microDigRequired,
      micro_dig_price: microDigPrice,
      micro_dig_notes: microDigNotes
    };
    
    console.log("Saving site requirements:", dataToSave);
    
    // Update the record in Supabase
    const { error } = await supabase
      .from('quotes')
      .update(dataToSave)
      .eq('id', quoteId);
    
    if (error) {
      console.error("Error updating site requirements:", error);
      throw error;
    }
    
    toast.success("Site requirements saved");
    return { success: true, totalCost };
  } catch (error) {
    console.error("Error saving site requirements:", error);
    toast.error("Failed to save site requirements");
    return { success: false, totalCost: 0 };
  }
};
