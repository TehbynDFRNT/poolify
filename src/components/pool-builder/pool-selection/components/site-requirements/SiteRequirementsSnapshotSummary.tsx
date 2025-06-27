import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useSnapshot } from "@/hooks/useSnapshot";
import { usePriceCalculator } from "@/hooks/calculations/use-calculator-totals";

interface SiteRequirementsSnapshotSummaryProps {
  customerId: string;
}

export const SiteRequirementsSnapshotSummary: React.FC<SiteRequirementsSnapshotSummaryProps> = ({
  customerId
}) => {
  // Fetch snapshot data - will be invalidated when selections change
  const { snapshot, loading: snapshotLoading } = useSnapshot(customerId);
  
  // Get price calculations
  const priceCalculatorResult = usePriceCalculator(snapshot);
  const { siteRequirementsBreakdown, fmt } = priceCalculatorResult;

  if (snapshotLoading || !snapshot) {
    return (
      <Card>
        <CardHeader className="bg-white">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">
              Site Requirements Summary
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

  // Apply the same logic as use-calculator-totals.ts
  const craneAllowance = 700;
  
  // Parse custom requirements to calculate total margin
  let customRequirementsMargin = 0;
  if (snapshot.site_requirements_data && Array.isArray(snapshot.site_requirements_data)) {
    customRequirementsMargin = snapshot.site_requirements_data.reduce((total, req) => {
      if (req && typeof req === 'object' && 'margin' in req) {
        return total + (Number(req.margin) || 0);
      }
      return total;
    }, 0);
  }
  
  // Calculate the actual site requirements total (only excess crane cost)
  const calculatedTotal = 
    siteRequirementsBreakdown.craneCost + // This is already the excess only
    siteRequirementsBreakdown.bobcatCost + 
    siteRequirementsBreakdown.trafficControlCost + 
    siteRequirementsBreakdown.customRequirementsCost;

  return (
    <Card>
      <CardHeader className="bg-white">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">
            Site Requirements Summary
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
                {/* Standard Requirements */}
                <tr className="border-b">
                  <td className="py-2">
                    Crane
                    {siteRequirementsBreakdown.craneCost > 0 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        (excess over ${craneAllowance} allowance)
                      </span>
                    )}
                  </td>
                  <td className="text-right py-2 text-green-600">-</td>
                  <td className="text-right py-2">
                    {siteRequirementsBreakdown.craneCost === 0 ? 
                      "Covered by allowance" : 
                      fmt(siteRequirementsBreakdown.craneCost)}
                  </td>
                </tr>
                {siteRequirementsBreakdown.trafficControlCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Traffic Control</td>
                    <td className="text-right py-2 text-green-600">-</td>
                    <td className="text-right py-2">{fmt(siteRequirementsBreakdown.trafficControlCost)}</td>
                  </tr>
                )}
                {siteRequirementsBreakdown.bobcatCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Bobcat</td>
                    <td className="text-right py-2 text-green-600">-</td>
                    <td className="text-right py-2">{fmt(siteRequirementsBreakdown.bobcatCost)}</td>
                  </tr>
                )}
                {siteRequirementsBreakdown.customRequirementsCost > 0 && (
                  <tr className="border-b">
                    <td className="py-2">Custom Requirements</td>
                    <td className="text-right py-2 text-green-600">{fmt(customRequirementsMargin)}</td>
                    <td className="text-right py-2">{fmt(siteRequirementsBreakdown.customRequirementsCost)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="pt-3 font-semibold">Total Site Requirements:</td>
                  <td className="text-right pt-3 font-semibold text-green-600">{fmt(customRequirementsMargin)}</td>
                  <td className="text-right pt-3 font-semibold">{fmt(calculatedTotal)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Note about crane allowance */}
          <p className="text-xs text-muted-foreground mt-2">
            *A standard ${craneAllowance} crane allowance is included in the base pool price
          </p>
        </div>
      </CardContent>
    </Card>
  );
};