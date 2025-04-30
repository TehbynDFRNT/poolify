
import { supabase } from "@/integrations/supabase/client";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { HeatPumpPoolMatch } from "@/types/heat-pump";

export async function fetchHeatPumpMatches() {
  const { data, error } = await supabase
    .from("heat_pump_pool_compatibility")
    .select("*");
    
  if (error) {
    throw error;
  }
  
  return data;
}

export async function createHeatPumpMatch(
  match: {
    pool_range: string;
    pool_model: string;
    heat_pump_id: string;
  },
  selectedHeatPump: HeatPumpProduct
) {
  const { data, error } = await supabase
    .from("heat_pump_pool_compatibility")
    .insert({
      pool_range: match.pool_range,
      pool_model: match.pool_model,
      heat_pump_id: match.heat_pump_id,
      hp_sku: selectedHeatPump.hp_sku,
      hp_description: selectedHeatPump.hp_description
    })
    .select()
    .single();

  if (error) {
    throw error;
  }
  
  return data;
}

export async function updateHeatPumpMatch(
  id: string, 
  heatPumpId: string, 
  selectedHeatPump: HeatPumpProduct
) {
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
}

export async function deleteHeatPumpMatch(id: string) {
  const { error } = await supabase
    .from("heat_pump_pool_compatibility")
    .delete()
    .eq("id", id);

  if (error) {
    throw error;
  }
  
  return true;
}
