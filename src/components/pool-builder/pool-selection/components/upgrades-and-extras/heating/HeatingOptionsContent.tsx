
import React, { useState } from "react";
import { Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { HeatPumpSection } from "./HeatPumpSection";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { Pool } from "@/types/pool";

interface HeatingOptionsContentProps {
  pool: Pool | null;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId
}) => {
  const [includeHeatPump, setIncludeHeatPump] = useState(false);
  const [includeBlanketRoller, setIncludeBlanketRoller] = useState(false);

  const {
    isLoading,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost,
  } = usePoolHeatingOptions(
    pool?.id || null,
    pool?.name,
    pool?.range
  );

  // Calculate costs
  const heatPumpInstallationCost = getInstallationCost("Heat Pump Installation");
  const blanketRollerInstallationCost = getInstallationCost("Blanket and Roller");

  const heatPumpTotalCost = includeHeatPump && compatibleHeatPump 
    ? (compatibleHeatPump.rrp || 0) + heatPumpInstallationCost
    : 0;

  const blanketRollerTotalCost = includeBlanketRoller && blanketRoller
    ? blanketRoller.rrp + blanketRollerInstallationCost
    : 0;

  const totalCost = heatPumpTotalCost + blanketRollerTotalCost;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Thermometer className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-medium">Pool Heating Options</h3>
      </div>
      
      {/* Heat Pump Section */}
      <Card className="border border-muted">
        <CardContent className="pt-6">
          <HeatPumpSection
            includeHeatPump={includeHeatPump}
            setIncludeHeatPump={setIncludeHeatPump}
            compatibleHeatPump={compatibleHeatPump}
            installationCost={heatPumpInstallationCost}
            totalCost={heatPumpTotalCost}
          />
        </CardContent>
      </Card>

      {/* Blanket & Roller Section */}
      <Card className="border border-muted">
        <CardContent className="pt-6">
          <BlanketRollerSection
            includeBlanketRoller={includeBlanketRoller}
            setIncludeBlanketRoller={setIncludeBlanketRoller}
            blanketRoller={blanketRoller}
            installationCost={blanketRollerInstallationCost}
            totalCost={blanketRollerTotalCost}
          />
        </CardContent>
      </Card>

      {/* Summary Section */}
      {(includeHeatPump || includeBlanketRoller) && (
        <div className="bg-primary/10 p-4 rounded-md">
          <div className="flex justify-between items-center">
            <h3 className="font-medium">Total Heating Options:</h3>
            <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
          </div>
          <div className="mt-3 flex justify-end">
            <Button disabled={!customerId}>
              Save Heating Options
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
