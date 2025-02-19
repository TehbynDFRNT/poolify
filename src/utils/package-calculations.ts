
import type { PackageWithComponents } from "@/types/filtration";

export const calculatePackagePrice = (pkg: PackageWithComponents) => {
  const componentPrices = [
    pkg.light?.price || 0,
    pkg.pump?.price || 0,
    pkg.sanitiser?.price || 0,
    pkg.filter?.price || 0,
  ];

  const handoverKitPrice = pkg.handover_kit?.components.reduce((total, comp) => {
    return total + ((comp.component?.price || 0) * comp.quantity);
  }, 0) || 0;

  return componentPrices.reduce((sum, price) => sum + price, 0) + handoverKitPrice;
};
