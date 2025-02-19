
import type { FiltrationPackageResponse } from "@/types/pool";

export const calculateFiltrationTotal = (pkg: FiltrationPackageResponse | null) => {
  if (!pkg) return 0;
  
  const handoverKitTotal = pkg.handover_kit?.components.reduce((total: number, comp) => {
    return total + ((comp.component?.price || 0) * comp.quantity);
  }, 0) || 0;

  return (
    (pkg.light?.price || 0) +
    (pkg.pump?.price || 0) +
    (pkg.sanitiser?.price || 0) +
    (pkg.filter?.price || 0) +
    handoverKitTotal
  );
};
