
import { supabase } from "@/integrations/supabase/client";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import type { HeatPumpPoolMatch } from "@/types/heat-pump";

export async function fetchHeatPumpMatches() {
  try {
    const { data, error } = await supabase
      .from("heat_pump_pool_compatibility")
      .select("*");
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Error fetching heat pump matches:", error);
    throw error;
  }
}

export async function createHeatPumpMatch(
  match: {
    pool_range: string;
    pool_model: string;
    heat_pump_id: string;
    hp_sku: string;
    hp_description: string;
  }
) {
  try {
    const { data, error } = await supabase
      .from("heat_pump_pool_compatibility")
      .insert(match)
      .select()
      .single();

    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Error creating heat pump match:", error);
    throw error;
  }
}

export async function updateHeatPumpMatch(
  id: string, 
  heatPumpId: string, 
  selectedHeatPump: HeatPumpProduct
) {
  try {
    const { error } = await supabase
      .from("heat_pump_pool_compatibility")
      .update({
        heat_pump_id: heatPumpId,
        hp_sku: selectedHeatPump.hp_sku,
        hp_description: selectedHeatPump.hp_description
      })
      .eq("id", id);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating heat pump match:", error);
    throw error;
  }
}

export async function deleteHeatPumpMatch(id: string) {
  try {
    const { error } = await supabase
      .from("heat_pump_pool_compatibility")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Error deleting heat pump match:", error);
    throw error;
  }
}

// This function creates all heat pump matches for pools that don't have them yet
export async function bulkCreateHeatPumpMatches(poolHeatPumpData: Array<{
  pool_range: string;
  pool_model: string;
  hp_sku: string;
  hp_description: string;
  heat_pump_id?: string;
}>, heatPumpProducts: HeatPumpProduct[]) {
  try {
    // Prepare data for bulk insert
    const matchesToCreate = poolHeatPumpData.map(match => {
      // Find matching heat pump by SKU or use first available heat pump
      const heatPump = match.heat_pump_id 
        ? heatPumpProducts.find(hp => hp.id === match.heat_pump_id)
        : heatPumpProducts.find(hp => hp.hp_sku === match.hp_sku) || heatPumpProducts[0];
      
      if (!heatPump) {
        throw new Error(`Heat pump with SKU ${match.hp_sku} not found`);
      }

      return {
        pool_range: match.pool_range,
        pool_model: match.pool_model,
        heat_pump_id: heatPump.id,
        hp_sku: match.hp_sku,
        hp_description: match.hp_description
      };
    });

    // Insert all records at once
    const { data, error } = await supabase
      .from("heat_pump_pool_compatibility")
      .insert(matchesToCreate)
      .select();

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error creating bulk heat pump matches:", error);
    throw error;
  }
}
