
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { HeatPumpPoolMatch } from "@/types/heat-pump";
import { Pool } from "@/types/pool";
import { createHeatPumpMatch } from "@/services/heatPumpMatrixService";

export function enrichMatchesWithHeatPumpData(
  matches: any[], 
  heatPumpProducts: HeatPumpProduct[]
): HeatPumpPoolMatch[] {
  return matches.map((match) => {
    const heatPump = heatPumpProducts.find(hp => hp.id === match.heat_pump_id);
    return {
      ...match,
      hp_sku: heatPump?.hp_sku || "Not assigned",
      hp_description: heatPump?.hp_description || "Not assigned",
      cost: heatPump?.cost || 0,
      margin: heatPump?.margin || 0,
      rrp: heatPump?.rrp || 0
    };
  });
}

export async function createMissingPoolMatches(
  pools: Pool[] | undefined,
  heatPumpProducts: HeatPumpProduct[],
  existingMatches: HeatPumpPoolMatch[]
) {
  if (!pools || pools.length === 0 || !heatPumpProducts || heatPumpProducts.length === 0) {
    return 0;
  }
  
  const existingPoolKeys = new Set(existingMatches.map(m => `${m.pool_range}-${m.pool_model}`));
  const missingPools = pools.filter(pool => !existingPoolKeys.has(`${pool.range || ""}-${pool.name}`));
  
  if (missingPools.length === 0) {
    return 0;
  }

  // Create default assignments for missing pools
  const defaultHeatPump = heatPumpProducts[0];
  
  for (const pool of missingPools) {
    await createHeatPumpMatch({
      pool_range: pool.range || "",
      pool_model: pool.name,
      heat_pump_id: defaultHeatPump.id,
    }, defaultHeatPump);
  }
  
  return missingPools.length;
}
