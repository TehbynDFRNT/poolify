import { Card, CardContent } from "@/components/ui/card";
// HeatPumpCompatibility and BlanketRoller types might not be needed if not displaying details
// import { HeatPumpCompatibility } from '@/hooks/usePoolHeatingOptions'; 
// import { BlanketRoller } from '@/types/blanket-roller';
import { formatCurrency } from "@/utils/format";
import { Check, X } from "lucide-react";
import React from 'react';

interface HeatingOptionsSummaryProps {
  // Remove props related to individual item details if only showing total
  // compatibleHeatPump: HeatPumpCompatibility | null;
  // blanketRoller: BlanketRoller | null;
  includeHeatPump: boolean; // Still needed to determine if anything is selected
  includeBlanketRoller: boolean; // Still needed to determine if anything is selected
  // heatPumpRrp: number;
  // blanketRollerRrp: number;
  // heatPumpInstallationCost: number;
  // blanketRollerInstallationCost: number;
  totalCost: number; // This is the main prop we need for the total
  totalMargin: number; // Total margin for all selected options
}

export const HeatingOptionsSummary: React.FC<HeatingOptionsSummaryProps> = ({
  // compatibleHeatPump, // Removed
  // blanketRoller, // Removed
  includeHeatPump,
  includeBlanketRoller,
  // heatPumpRrp, // Removed
  // blanketRollerRrp, // Removed
  // heatPumpInstallationCost, // Removed
  // blanketRollerInstallationCost, // Removed
  totalCost,
  totalMargin,
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
        {/* Simplified content - only total cost */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Selected Heating Options Total</h3>
          <div className="flex items-center gap-2 text-green-600">
            <Check className="h-4 w-4" />
            <span>Included</span>
          </div>
        </div>
        <div className="flex justify-between border-t pt-2 mt-2">
          <p className="text-lg font-semibold">Total Cost:</p>
          <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
        </div>
        {totalMargin > 0 && (
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Total Margin:</span>
            <span>{formatCurrency(totalMargin)}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
