
import React from "react";
import { Thermometer, Check, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/utils/format";
import { HeatPumpCompatibility } from "@/hooks/usePoolHeatingOptions";

interface HeatPumpSectionProps {
  includeHeatPump: boolean;
  setIncludeHeatPump: (include: boolean) => void;
  compatibleHeatPump: HeatPumpCompatibility | null;
  installationCost: number;
  totalCost: number;
}

export const HeatPumpSection: React.FC<HeatPumpSectionProps> = ({
  includeHeatPump,
  setIncludeHeatPump,
  compatibleHeatPump,
  installationCost,
  totalCost
}) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Thermometer className="h-4 w-4 text-primary" />
          <Label htmlFor="heat-pump-switch" className="font-medium">
            Would you like to add a pool heat pump?
          </Label>
        </div>
        <Switch 
          id="heat-pump-switch"
          checked={includeHeatPump}
          onCheckedChange={setIncludeHeatPump}
        />
      </div>
      
      {includeHeatPump && (
        <div className="bg-muted/30 p-4 rounded-md space-y-3">
          {compatibleHeatPump ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Compatible Heat Pump</p>
                  <div className="flex gap-2 items-center">
                    <Check className="h-4 w-4 text-green-500" />
                    <p>{compatibleHeatPump.hp_description}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">SKU: {compatibleHeatPump.hp_sku}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <p className="text-sm">Equipment Cost:</p>
                    <p className="font-medium">{formatCurrency(compatibleHeatPump.rrp || 0)}</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm">Installation Cost:</p>
                    <p className="font-medium">{formatCurrency(installationCost)}</p>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <p>Margin:</p>
                    <p>{formatCurrency(compatibleHeatPump.margin || 0)}</p>
                  </div>
                  <div className="flex justify-between border-t pt-1 mt-1">
                    <p className="text-sm font-medium">Total Cost:</p>
                    <p className="font-bold">{formatCurrency(totalCost)}</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-amber-600">
              <X className="h-4 w-4" />
              <p>No compatible heat pump found for this pool model.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
