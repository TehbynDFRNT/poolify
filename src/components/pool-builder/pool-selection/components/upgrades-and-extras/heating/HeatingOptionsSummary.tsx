import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface HeatingOptionsSummaryProps {
  includeHeatPump: boolean;
  includeBlanketRoller: boolean;
  heatPumpCost: number;
  heatPumpMargin: number;
  blanketRollerCost: number;
  blanketRollerMargin: number;
  totalCost: number;
  totalMargin: number;
}

export const HeatingOptionsSummary: React.FC<HeatingOptionsSummaryProps> = ({
  includeHeatPump,
  includeBlanketRoller,
  heatPumpCost,
  heatPumpMargin,
  blanketRollerCost,
  blanketRollerMargin,
  totalCost,
  totalMargin,
}) => {
  const fmt = (value: number) => formatCurrency(value);
  const hasSelections = includeHeatPump || includeBlanketRoller;

  return (
    <Card>
      <CardHeader className="bg-white">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">
            Heating Options Summary
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {!hasSelections ? (
          <div className="text-center py-4 text-muted-foreground">
            No heating options selected
          </div>
        ) : (
          <div className="space-y-4">
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
                  {includeHeatPump && (
                    <tr className="border-b">
                      <td className="py-2">Heat Pump (incl. installation)</td>
                      <td className="text-right py-2 text-green-600">{fmt(heatPumpMargin)}</td>
                      <td className="text-right py-2">{fmt(heatPumpCost)}</td>
                    </tr>
                  )}
                  {includeBlanketRoller && (
                    <tr className="border-b">
                      <td className="py-2">Blanket Roller (incl. installation)</td>
                      <td className="text-right py-2 text-green-600">{fmt(blanketRollerMargin)}</td>
                      <td className="text-right py-2">{fmt(blanketRollerCost)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td className="pt-3 font-semibold">Total Heating Options:</td>
                    <td className="text-right pt-3 font-semibold text-green-600">{fmt(totalMargin)}</td>
                    <td className="text-right pt-3 font-semibold">{fmt(totalCost)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};