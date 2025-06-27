import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useSnapshot } from "@/hooks/useSnapshot";
import { usePriceCalculator } from "@/hooks/calculations/use-calculator-totals";

interface ConcreteAndPavingSnapshotSummaryProps {
  pool: any;
  customerId: string;
}

export const ConcreteAndPavingSnapshotSummary: React.FC<ConcreteAndPavingSnapshotSummaryProps> = ({ 
  pool, 
  customerId 
}) => {
  // Fetch snapshot data - will be invalidated when selections change
  const { snapshot, loading: snapshotLoading } = useSnapshot(customerId);
  
  // Get price calculations
  const priceCalculatorResult = usePriceCalculator(snapshot);
  const { totals, fmt } = priceCalculatorResult;

  if (snapshotLoading || !snapshot) {
    return (
      <Card>
        <CardHeader className="bg-white">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">
              Concrete & Paving Summary
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-5">
          <div className="text-center py-4 text-muted-foreground">
            Loading summary data...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Extract individual concrete/paving costs and margins from snapshot
  const concreteCutsCost = Number(snapshot.concrete_cuts_cost || 0);
  const extraPavingCost = Number(snapshot.extra_paving_cost || 0);
  const extraPavingMargin = (snapshot.epc_margin_cost || 0) * (snapshot.extra_paving_sqm || 0);
  const existingPavingCost = Number(snapshot.existing_paving_cost || 0);
  const existingPavingMargin = (snapshot.existing_paving_margin_cost || 0) * (snapshot.existing_paving_sqm || 0);
  
  // For extra concreting, if cost is null but we have sqm and unit price, calculate it
  let extraConcretingCost = Number(snapshot.extra_concreting_cost || 0);
  if (!extraConcretingCost && snapshot.extra_concreting_sqm && snapshot.extra_concreting_unit_price) {
    extraConcretingCost = snapshot.extra_concreting_sqm * snapshot.extra_concreting_unit_price;
  }
  
  const extraConcretingMargin = (snapshot.extra_concreting_margin || 0) * (snapshot.extra_concreting_sqm || 0);
  const concretePumpCost = Number(snapshot.concrete_pump_total_cost || 0) + Number(snapshot.extra_concrete_pump_total_cost || 0);
  const underFenceStripsCost = Number(snapshot.uf_strips_cost || 0);
  
  // Calculate under fence strips margin from the data
  let underFenceStripsMargin = 0;
  if (snapshot.uf_strips_data && Array.isArray(snapshot.uf_strips_data)) {
    underFenceStripsMargin = snapshot.uf_strips_data.reduce((total, strip) => {
      return total + (strip.unit_margin * strip.length);
    }, 0);
  }

  // Calculate total margin (excluding items without margin data)
  const totalMargin = extraPavingMargin + existingPavingMargin + extraConcretingMargin + underFenceStripsMargin;

  // Get total from calculator
  const concreteTotal = totals?.concreteTotal || 0;

  return (
    <Card>
      <CardHeader className="bg-white">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">
            Concrete & Paving Summary
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="space-y-4">
          {/* Cost Breakdown Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Item</th>
                  <th className="text-right py-2 font-medium">Margin</th>
                  <th className="text-right py-2 font-medium">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {extraPavingCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Extra Paving</td>
                    <td className="text-right py-2 text-green-600">{fmt(extraPavingMargin)}</td>
                    <td className="text-right py-2">{fmt(extraPavingCost)}</td>
                  </tr>
                )}
                {existingPavingCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Paving on Existing Concrete</td>
                    <td className="text-right py-2 text-green-600">{fmt(existingPavingMargin)}</td>
                    <td className="text-right py-2">{fmt(existingPavingCost)}</td>
                  </tr>
                )}
                {extraConcretingCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Extra Concreting</td>
                    <td className="text-right py-2 text-green-600">{fmt(extraConcretingMargin)}</td>
                    <td className="text-right py-2">{fmt(extraConcretingCost)}</td>
                  </tr>
                )}
                {concretePumpCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Concrete Pump</td>
                    <td className="text-right py-2 text-green-600">-</td>
                    <td className="text-right py-2">{fmt(concretePumpCost)}</td>
                  </tr>
                )}
                {underFenceStripsCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Under Fence Concrete Strips</td>
                    <td className="text-right py-2 text-green-600">{fmt(underFenceStripsMargin)}</td>
                    <td className="text-right py-2">{fmt(underFenceStripsCost)}</td>
                  </tr>
                )}
                {concreteCutsCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Concrete Cuts</td>
                    <td className="text-right py-2 text-green-600">-</td>
                    <td className="text-right py-2">{fmt(concreteCutsCost)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="pt-3 font-semibold">Total Concrete & Paving:</td>
                  <td className="text-right pt-3 font-semibold text-green-600">{fmt(totalMargin)}</td>
                  <td className="text-right pt-3 font-semibold">{fmt(concreteTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};