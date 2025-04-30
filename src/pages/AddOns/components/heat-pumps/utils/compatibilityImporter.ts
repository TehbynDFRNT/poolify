
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { PoolCompatibility } from "@/hooks/useHeatPumpPoolCompatibility";

type CompatibilityRow = {
  pool_model: string;
  hp_sku: string;
  hp_description: string;
  pool_range?: string;
};

export const prepareCompatibilityData = (
  data: CompatibilityRow[], 
  heatPumpProducts: HeatPumpProduct[]
): Omit<PoolCompatibility, "id" | "created_at" | "updated_at">[] => {
  const result: Omit<PoolCompatibility, "id" | "created_at" | "updated_at">[] = [];
  
  // Create a lookup map for heat pumps by SKU
  const heatPumpMap = new Map<string, HeatPumpProduct>();
  heatPumpProducts.forEach(hp => {
    heatPumpMap.set(hp.hp_sku, hp);
  });
  
  // Process each row of compatibility data
  data.forEach(row => {
    // Find the corresponding heat pump by SKU
    const heatPump = heatPumpMap.get(row.hp_sku);
    
    if (heatPump) {
      result.push({
        heat_pump_id: heatPump.id,
        pool_range: row.pool_range || "Unknown",
        pool_model: row.pool_model,
        hp_sku: row.hp_sku,
        hp_description: row.hp_description
      });
    }
  });
  
  return result;
};
