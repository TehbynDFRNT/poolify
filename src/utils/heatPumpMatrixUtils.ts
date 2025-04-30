
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import type { HeatPumpPoolMatch } from "@/types/heat-pump";
import { Pool } from "@/types/pool";

export function enrichMatchesWithHeatPumpData(
  matches: any[], 
  heatPumpProducts: HeatPumpProduct[]
): HeatPumpPoolMatch[] {
  return matches.map((match) => {
    const heatPump = heatPumpProducts.find(hp => hp.id === match.heat_pump_id);
    return {
      ...match,
      hp_sku: match.hp_sku || (heatPump?.hp_sku || "Not assigned"),
      hp_description: match.hp_description || (heatPump?.hp_description || "Not assigned"),
      cost: heatPump?.cost || 0,
      margin: heatPump?.margin || 0,
      rrp: heatPump?.rrp || 0
    };
  });
}

// Default pool-heat pump matches data
export const defaultHeatPumpMatches = [
  { pool_range: "Piazza", pool_model: "Alto", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Latina", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Sovereign", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Empire", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Oxford", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Avellino", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Palazzo", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Valentina", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Westminster", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
  { pool_range: "Piazza", pool_model: "Kensington", hp_sku: "IX24", hp_description: "Sunlover Oasis 24kW Heat Pump" },
  { pool_range: "Latin", pool_model: "Verona", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Latin", pool_model: "Portofino", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Latin", pool_model: "Florentina", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Latin", pool_model: "Bellagio", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Contemporary", pool_model: "Bellino", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Contemporary", pool_model: "Imperial", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Contemporary", pool_model: "Castello", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Contemporary", pool_model: "Grandeur", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
  { pool_range: "Contemporary", pool_model: "Amalfi", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
  { pool_range: "Vogue", pool_model: "Serenity", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Vogue", pool_model: "Allure", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Vogue", pool_model: "Harmony", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Villa", pool_model: "Istana", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Villa", pool_model: "Terazza", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Villa", pool_model: "Elysian", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Entertainer", pool_model: "Bedarra", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
  { pool_range: "Entertainer", pool_model: "Hayman", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
  { pool_range: "Round Pools", pool_model: "Infinity 3", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Round Pools", pool_model: "Infinity 4", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
  { pool_range: "Round Pools", pool_model: "Terrace 3", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
];
