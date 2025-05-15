
import React from "react";
import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import { PackageWithComponents } from "@/types/filtration";

interface PoolCostsSummaryContentProps {
  pool: Pool;
  filtrationPackage: PackageWithComponents | null;
  excavationCost: number | null;
  concreteCost: number | null;
}

export const PoolCostsSummaryContent: React.FC<PoolCostsSummaryContentProps> = ({
  pool,
  filtrationPackage,
  excavationCost,
  concreteCost,
}) => {
  const shellCost = pool.buy_price_inc_gst || 0;

  // Use price_inc_gst instead of price
  const filtrationCost = 
    (filtrationPackage?.pump?.price_inc_gst || 0) +
    (filtrationPackage?.filter?.price_inc_gst || 0) +
    (filtrationPackage?.sanitiser?.price_inc_gst || 0) + 
    (filtrationPackage?.light?.price_inc_gst || 0) +
    (filtrationPackage?.handover_kit?.components?.reduce(
      (acc, item) => acc + ((item.component?.price_inc_gst || 0) * item.quantity), 0
    ) || 0);

  const totalCost =
    shellCost +
    (excavationCost || 0) +
    (concreteCost || 0) +
    filtrationCost;

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Pool Shell:</span>
        <span>{formatCurrency(shellCost)}</span>
      </div>
      {excavationCost !== null && (
        <div className="flex justify-between">
          <span>Excavation:</span>
          <span>{formatCurrency(excavationCost)}</span>
        </div>
      )}
      {concreteCost !== null && (
        <div className="flex justify-between">
          <span>Concrete:</span>
          <span>{formatCurrency(concreteCost)}</span>
        </div>
      )}
      {filtrationPackage && (
        <div className="flex justify-between">
          <span>Filtration:</span>
          <span>{formatCurrency(filtrationCost)}</span>
        </div>
      )}
      <div className="flex justify-between font-medium">
        <span>Total:</span>
        <span>{formatCurrency(totalCost)}</span>
      </div>
    </div>
  );
};
