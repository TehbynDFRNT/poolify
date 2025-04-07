
import React from "react";
import { formatCurrency } from "@/utils/format";
import { PackageWithComponents } from "@/types/filtration";
import { calculatePackagePrice } from "@/utils/package-calculations";

interface FiltrationTotalPriceProps {
  filtrationPackage: PackageWithComponents;
}

export const FiltrationTotalPrice: React.FC<FiltrationTotalPriceProps> = ({ filtrationPackage }) => {
  return (
    <div className="mt-4 pt-4 border-t border-muted flex justify-between items-center">
      <span className="font-medium">Total Package Price:</span>
      <span className="font-bold text-lg">{formatCurrency(calculatePackagePrice(filtrationPackage))}</span>
    </div>
  );
};
