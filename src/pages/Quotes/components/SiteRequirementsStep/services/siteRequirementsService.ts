
import { supabase } from "@/integrations/supabase/client";
import { CustomSiteRequirement } from "../types";
import { toast } from "sonner";

interface SaveRequirementsParams {
  quoteId: string;
  craneId: string | null;
  trafficControlId: string;
  bobcatId: string | undefined;
  customRequirements: CustomSiteRequirement[];
  microDigRequired: boolean;
  microDigPrice: number;
  microDigNotes: string;
}

export const saveRequirements = async ({
  quoteId,
  craneId,
  trafficControlId,
  bobcatId,
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
    
    // Fetch bobcat cost if selected
    if (bobcatId && bobcatId !== 'none') {
      const { data: bobcatData } = await supabase
        .from('bobcat_costs')
        .select('price')
        .eq('id', bobcatId)
        .single();
      
      if (bobcatData) {
        totalCost += bobcatData.price;
      }
    }
    
    // Fetch crane costs for comparison if crane selected
    if (craneId) {
      // Find the default crane (Franna)
      const { data: defaultCrane } = await supabase
        .from('crane_costs')
        .select('price')
        .eq('name', 'Franna Crane-S20T-L1')
        .single();
      
      // Get selected crane
      const { data: selectedCrane } = await supabase
        .from('crane_costs')
        .select('price')
        .eq('id', craneId)
        .single();
      
      if (defaultCrane && selectedCrane && selectedCrane.price !== defaultCrane.price) {
        // Add only the difference in price between selected crane and default
        totalCost += selectedCrane.price - defaultCrane.price;
      }
    }
    
    // Fetch traffic control cost if selected
    if (trafficControlId && trafficControlId !== 'none') {
      const { data: trafficControlData } = await supabase
        .from('traffic_control_costs')
        .select('price')
        .eq('id', trafficControlId)
        .single();
      
      if (trafficControlData) {
        totalCost += trafficControlData.price;
      }
    }
    
    // Add custom requirements costs
    totalCost += customRequirements.reduce((sum, req) => sum + (req.price || 0), 0);
    
    // Add micro dig cost if required
    if (microDigRequired) {
      totalCost += microDigPrice;
    }
    
    console.log("Saving site requirements:", {
      crane_id: craneId,
      traffic_control_id: trafficControlId === 'none' ? null : trafficControlId,
      bobcat_id: bobcatId === 'none' ? null : bobcatId,
      site_requirements_cost: totalCost,
      micro_dig_required: microDigRequired,
      micro_dig_price: microDigPrice,
      micro_dig_notes: microDigNotes
    });
    
    // Data to save to database
    const dataToSave = {
      crane_id: craneId,
      traffic_control_id: trafficControlId === 'none' ? null : trafficControlId,
      bobcat_id: bobcatId === 'none' ? null : bobcatId,
      site_requirements_cost: totalCost,
      micro_dig_required: microDigRequired,
      micro_dig_price: microDigPrice,
      micro_dig_notes: microDigNotes
    };
    
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
