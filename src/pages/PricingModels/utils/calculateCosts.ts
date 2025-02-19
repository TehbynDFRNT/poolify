
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import type { FixedCost } from "@/types/fixed-cost";
import type { PackageWithComponents } from "@/types/filtration";
import { initialPoolCosts } from "@/pages/ConstructionCosts/constants";

export const calculateFiltrationTotal = (filtrationPackage: PackageWithComponents | null) => {
  if (!filtrationPackage) return 0;
  
  const handoverKitTotal = filtrationPackage.handover_kit?.components.reduce((total, comp) => {
    return total + ((comp.component?.price || 0) * comp.quantity);
  }, 0) || 0;

  return (
    (filtrationPackage.light?.price || 0) +
    (filtrationPackage.pump?.price || 0) +
    (filtrationPackage.sanitiser?.price || 0) +
    (filtrationPackage.filter?.price || 0) +
    handoverKitTotal
  );
};

export const calculatePoolSpecificCosts = (
  poolName: string,
  digType: ExcavationDigType | null
) => {
  const poolCosts = initialPoolCosts[poolName] || {
    truckedWater: 0,
    saltBags: 0,
    copingSupply: 0,
    beam: 0,
    copingLay: 0,
    peaGravel: 0,
    installFee: 0
  };

  const excavationCost = digType ? 
    (digType.truck_count * digType.truck_hourly_rate * digType.truck_hours) +
    (digType.excavation_hourly_rate * digType.excavation_hours) : 0;

  return (
    poolCosts.truckedWater +
    poolCosts.saltBags +
    poolCosts.copingSupply +
    poolCosts.beam +
    poolCosts.copingLay +
    poolCosts.peaGravel +
    poolCosts.installFee +
    excavationCost
  );
};

export const calculateFixedCostsTotal = (fixedCosts: FixedCost[]) => {
  return fixedCosts.reduce((sum, cost) => sum + cost.price, 0);
};
