import { Pool } from "@/types/pool";
import { formatCurrency } from "@/utils/format";
import React from "react";
import { useSnapshot } from "@/hooks/useSnapshot";
import { usePriceCalculator } from "@/hooks/calculations/use-calculator-totals";

interface PoolCostsSummaryContentProps {
  pool: Pool;
  customerId?: string;
}

export const PoolCostsSummaryContent: React.FC<PoolCostsSummaryContentProps> = ({
  pool,
  customerId,
}) => {
  // Fetch snapshot data - will be invalidated when pool selection changes
  const { snapshot, loading: snapshotLoading } = useSnapshot(customerId || '');
  
  // Get price calculations
  const priceCalculatorResult = usePriceCalculator(snapshot);
  const { basePoolBreakdown, fmt } = priceCalculatorResult;
  
  // Calculate margin percentage and amounts
  const marginPct = snapshot?.pool_margin_pct || 0;
  
  // If no snapshot data, show basic pool shell cost
  if (!snapshot || !customerId) {
    return (
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Pool Shell Inc GST:</span>
          <span>{formatCurrency(pool.buy_price_inc_gst || 0)}</span>
        </div>
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-medium">
            <span>Total:</span>
            <span>{formatCurrency(pool.buy_price_inc_gst || 0)}</span>
          </div>
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          <p>Complete cost breakdown requires customer selection</p>
        </div>
      </div>
    );
  }

  // Calculate margin amounts for each component
  const poolShellMargin = basePoolBreakdown.poolShellPrice - basePoolBreakdown.poolShellCost;
  const fixedCostsMargin = basePoolBreakdown.fixedCostsPrice - basePoolBreakdown.fixedCostsTotal;
  const individualCostsMargin = basePoolBreakdown.individualCostsPrice - basePoolBreakdown.individualCosts;
  const filtrationMargin = basePoolBreakdown.filtrationPrice - basePoolBreakdown.filtrationCost;
  const digMargin = basePoolBreakdown.digPrice - basePoolBreakdown.digCost;
  const craneAllowanceMargin = basePoolBreakdown.craneAllowancePrice - basePoolBreakdown.craneAllowance;
  
  const totalMargin = poolShellMargin + fixedCostsMargin + individualCostsMargin + 
                     filtrationMargin + digMargin + craneAllowanceMargin;

  return (
    <div className="space-y-4">
      {/* Cost Breakdown Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 font-medium">Item</th>
              <th className="text-right py-2 font-medium">Base Cost</th>
              <th className="text-right py-2 font-medium">Margin</th>
              <th className="text-right py-2 font-medium">Total Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Pool Shell Inc GST</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.poolShellCost)}</td>
              <td className="text-right py-2 text-green-600">{fmt(poolShellMargin)}</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.poolShellPrice)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Fixed Costs</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.fixedCostsTotal)}</td>
              <td className="text-right py-2 text-green-600">{fmt(fixedCostsMargin)}</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.fixedCostsPrice)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Variable (Individual) Costs</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.individualCosts)}</td>
              <td className="text-right py-2 text-green-600">{fmt(individualCostsMargin)}</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.individualCostsPrice)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Filtration</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.filtrationCost)}</td>
              <td className="text-right py-2 text-green-600">{fmt(filtrationMargin)}</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.filtrationPrice)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Excavation</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.digCost)}</td>
              <td className="text-right py-2 text-green-600">{fmt(digMargin)}</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.digPrice)}</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Standard Crane Allowance</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.craneAllowance)}</td>
              <td className="text-right py-2 text-green-600">{fmt(craneAllowanceMargin)}</td>
              <td className="text-right py-2">{fmt(basePoolBreakdown.craneAllowancePrice)}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="border-t-2">
              <td className="pt-3 font-semibold">Total Pool Selection:</td>
              <td className="text-right pt-3 font-semibold">{fmt(basePoolBreakdown.totalBeforeMargin)}</td>
              <td className="text-right pt-3 font-semibold text-green-600">{fmt(totalMargin)}</td>
              <td className="text-right pt-3 font-semibold">{fmt(priceCalculatorResult.totals.basePoolTotal)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* Margin percentage note */}
      <div className="text-xs text-muted-foreground">
        *Margin of {marginPct}% applied using formula: Cost ÷ (1 - {marginPct}%)
      </div>
    </div>
  );
};
