
import { PackageWithComponents } from "@/types/filtration";

export const calculatePackagePrice = (filtrationPackage: PackageWithComponents): number => {
  let totalPrice = 0;

  // Add component prices
  if (filtrationPackage.pump) {
    totalPrice += filtrationPackage.pump.price_inc_gst || 0;
  }

  if (filtrationPackage.filter) {
    totalPrice += filtrationPackage.filter.price_inc_gst || 0;
  }

  if (filtrationPackage.sanitiser) {
    totalPrice += filtrationPackage.sanitiser.price_inc_gst || 0;
  }
  
  if (filtrationPackage.light) {
    totalPrice += filtrationPackage.light.price_inc_gst || 0;
  }

  // Add handover kit components
  if (filtrationPackage.handover_kit?.components) {
    filtrationPackage.handover_kit.components.forEach(item => {
      if (item.component) {
        totalPrice += (item.component.price_inc_gst || 0) * (item.quantity || 1);
      }
    });
  }

  return totalPrice;
};
