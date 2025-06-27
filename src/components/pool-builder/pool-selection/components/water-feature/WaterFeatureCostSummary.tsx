
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WaterFeatureSummary } from "@/types/water-feature";
import { Calculator } from "lucide-react";

interface WaterFeatureCostSummaryProps {
  summary: WaterFeatureSummary;
  hasBackCladding: boolean;
}

export const WaterFeatureCostSummary: React.FC<WaterFeatureCostSummaryProps> = ({
  summary,
  hasBackCladding,
}) => {
  const { 
    basePrice, 
    baseMargin, 
    backCladdingPrice, 
    backCladdingMargin, 
    bladePrice, 
    bladeMargin, 
    totalCost, 
    selectedBladeName 
  } = summary;

  const totalMargin = baseMargin + 
    (hasBackCladding ? backCladdingMargin : 0) + 
    (selectedBladeName !== "None" ? bladeMargin : 0);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader className="bg-white">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">
            Water Feature Summary
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
                <tr className="border-b">
                  <td className="py-2">Water Feature Base</td>
                  <td className="text-right py-2 text-green-600">{formatCurrency(baseMargin)}</td>
                  <td className="text-right py-2">{formatCurrency(basePrice)}</td>
                </tr>
                {hasBackCladding && (
                  <tr className="border-b">
                    <td className="py-2">Back Cladding</td>
                    <td className="text-right py-2 text-green-600">{formatCurrency(backCladdingMargin)}</td>
                    <td className="text-right py-2">{formatCurrency(backCladdingPrice)}</td>
                  </tr>
                )}
                {selectedBladeName !== "None" && bladePrice > 0 && (
                  <tr className="border-b">
                    <td className="py-2">{selectedBladeName}</td>
                    <td className="text-right py-2 text-green-600">{formatCurrency(bladeMargin)}</td>
                    <td className="text-right py-2">{formatCurrency(bladePrice)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2">
                  <td className="pt-3 font-semibold">Total Water Feature:</td>
                  <td className="text-right pt-3 font-semibold text-green-600">{formatCurrency(totalMargin)}</td>
                  <td className="text-right pt-3 font-semibold">{formatCurrency(totalCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <p className="text-xs text-muted-foreground">
            *All prices include margin — no additional markup needed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
