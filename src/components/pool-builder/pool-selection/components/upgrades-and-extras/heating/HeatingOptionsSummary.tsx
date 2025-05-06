import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { Check, X } from "lucide-react";
import React from 'react';

interface HeatingOptionsSummaryProps {
  includeHeatPump: boolean;
  includeBlanketRoller: boolean;
  heatPumpRrp: number;
  blanketRollerRrp: number;
  heatPumpInstallationCost: number;
  blanketRollerInstallationCost: number;
  totalCost: number;
}

export const HeatingOptionsSummary: React.FC<HeatingOptionsSummaryProps> = ({
  includeHeatPump,
  includeBlanketRoller,
  heatPumpRrp,
  blanketRollerRrp,
  heatPumpInstallationCost,
  blanketRollerInstallationCost,
  totalCost,
}) => {
  const hasSelections = includeHeatPump || includeBlanketRoller;

  if (!hasSelections) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">No heating options selected</p>
            <div className="flex items-center gap-2 text-amber-600">
              <X className="h-4 w-4" />
              <span>Not included</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Selected Heating Options</h3>
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span>Included</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              {includeHeatPump && (
                <div className="mb-3">
                  <p className="text-sm font-medium">Heat Pump</p>
                  <div className="text-sm mt-1">
                    <div className="flex justify-between">
                      <span>Heat Pump Cost:</span>
                      <span>{formatCurrency(heatPumpRrp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation:</span>
                      <span>{formatCurrency(heatPumpInstallCost)}</span>
                    </div>
                  </div>
                </div>
              )}

              {includeBlanketRoller && (
                <div>
                  <p className="text-sm font-medium">Blanket & Roller</p>
                  <div className="text-sm mt-1">
                    <div className="flex justify-between">
                      <span>Blanket & Roller Cost:</span>
                      <span>{formatCurrency(blanketRollerRrp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation:</span>
                      <span>{formatCurrency(blanketRollerInstallCost)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex justify-between border-t pt-1 mt-1">
                <p className="text-sm font-medium">Total Cost:</p>
                <p className="font-bold">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
