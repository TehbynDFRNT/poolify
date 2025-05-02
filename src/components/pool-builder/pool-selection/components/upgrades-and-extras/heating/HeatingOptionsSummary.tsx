
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { Check, X } from "lucide-react";
import { HeatPumpCompatibility } from '@/hooks/usePoolHeatingOptions';
import { BlanketRoller } from '@/types/blanket-roller';

interface HeatingOptionsSummaryProps {
  compatibleHeatPump: HeatPumpCompatibility | null;
  blanketRoller: BlanketRoller | null;
  includeHeatPump: boolean;
  includeBlanketRoller: boolean;
  heatPumpInstallationCost: number;
  blanketRollerInstallationCost: number;
  totalCost: number;
}

export const HeatingOptionsSummary: React.FC<HeatingOptionsSummaryProps> = ({
  compatibleHeatPump,
  blanketRoller,
  includeHeatPump,
  includeBlanketRoller,
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
              {includeHeatPump && compatibleHeatPump && (
                <div className="mb-3">
                  <p className="text-sm font-medium">Heat Pump</p>
                  <p className="text-sm text-muted-foreground">{compatibleHeatPump.hp_description}</p>
                  <div className="text-sm mt-1">
                    <div className="flex justify-between">
                      <span>Heat Pump Cost:</span>
                      <span>{formatCurrency(compatibleHeatPump.rrp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation:</span>
                      <span>{formatCurrency(heatPumpInstallationCost)}</span>
                    </div>
                  </div>
                </div>
              )}

              {includeBlanketRoller && blanketRoller && (
                <div>
                  <p className="text-sm font-medium">Blanket & Roller</p>
                  <p className="text-sm text-muted-foreground">{blanketRoller.description}</p>
                  <div className="text-sm mt-1">
                    <div className="flex justify-between">
                      <span>Blanket & Roller Cost:</span>
                      <span>{formatCurrency(blanketRoller.rrp)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Installation:</span>
                      <span>{formatCurrency(blanketRollerInstallationCost)}</span>
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
