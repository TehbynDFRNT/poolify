
import { PackageWithComponents } from "@/types/filtration";
import { calculatePackagePrice } from "@/utils/package-calculations";

export const createPackagesByPoolId = (poolsWithPackages?: any[]) => {
  return poolsWithPackages?.reduce((acc, pool) => {
    if (pool.default_filtration_package_id && pool.default_package) {
      acc[pool.id] = pool.default_package;
    }
    return acc;
  }, {} as Record<string, any>) || {};
};

// Calculate excavation cost for a pool
export const calculateExcavationCost = (poolId: string, matches?: Map<string, any>) => {
  const match = matches?.get(poolId);
  if (!match || !match.dig_type) return 0;
  
  const digType = match.dig_type;
  const excavationCost = (digType.excavation_hours * digType.excavation_hourly_rate) +
                        (digType.truck_quantity * digType.truck_hours * digType.truck_hourly_rate);
  
  return excavationCost;
};

export { calculatePackagePrice };
