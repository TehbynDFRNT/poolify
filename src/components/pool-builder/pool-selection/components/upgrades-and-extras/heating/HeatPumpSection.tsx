
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { HeatPumpCompatibility } from "@/hooks/usePoolHeatingOptions";
import { formatCurrency } from "@/utils/format";

interface HeatPumpSectionProps {
  compatibleHeatPump: HeatPumpCompatibility | null;
  includeHeatPump: boolean;
  setIncludeHeatPump: (include: boolean) => void;
  installationCost: number;
  totalCost: number;
}

export const HeatPumpSection: React.FC<HeatPumpSectionProps> = ({
  compatibleHeatPump,
  includeHeatPump,
  setIncludeHeatPump,
  installationCost,
  totalCost
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Heat Pump</CardTitle>
        <CardDescription>
          Extend your swimming season with an energy-efficient heat pump
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="include-heat-pump" className="flex-1">
            Include heat pump
          </Label>
          <Switch 
            id="include-heat-pump" 
            checked={includeHeatPump} 
            onCheckedChange={setIncludeHeatPump}
            disabled={!compatibleHeatPump}
          />
        </div>

        {!compatibleHeatPump && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-md">
            <p className="text-amber-700">
              No compatible heat pump found for this pool model. Please contact support for assistance.
            </p>
          </div>
        )}

        {includeHeatPump && compatibleHeatPump && (
          <div className="space-y-4 mt-4">
            <div className="bg-slate-50 p-4 rounded-md space-y-2">
              <h4 className="font-medium">{compatibleHeatPump.hp_description}</h4>
              <div className="flex justify-between">
                <span className="text-sm">Model:</span>
                <span className="text-sm font-medium">{compatibleHeatPump.hp_sku}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price:</span>
                <span className="text-sm font-medium">{formatCurrency(compatibleHeatPump.rrp)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Heat Pump:</span>
                <span className="text-sm">{formatCurrency(compatibleHeatPump.rrp)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Installation:</span>
                <span className="text-sm">{formatCurrency(installationCost)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-medium">Total:</span>
                <span className="font-medium">{formatCurrency(totalCost)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
