
import React from "react";
import { Thermometer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { HeatPumpSection } from "./HeatPumpSection";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { HeatingOptionsSummary } from "./HeatingOptionsSummary";
import { Pool } from "@/types/pool";
import { useHeatingOptionsState } from "@/hooks/useHeatingOptionsState";

interface HeatingOptionsContentProps {
  pool: Pool | null;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId
}) => {
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

  // Calculate installation costs
  const heatPumpInstallationCost = getInstallationCost("Heat Pump");
  const blanketRollerInstallationCost = getInstallationCost("Blanket & Roller");

  const {
    includeHeatPump,
    setIncludeHeatPump,
    includeBlanketRoller,
    setIncludeBlanketRoller,
    isSaving,
    saveHeatingOptions,
    heatPumpTotalCost,
    blanketRollerTotalCost,
    totalCost,
    totalMargin
  } = useHeatingOptionsState({
    poolId: pool?.id || null,
    customerId,
    compatibleHeatPump,
    blanketRoller,
    heatPumpInstallationCost,
    blanketRollerInstallationCost
  });

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
        <HeatingOptionsSummary
          totalCost={totalCost}
          totalMargin={totalMargin}
          isSaving={isSaving}
          onSave={saveHeatingOptions}
          customerId={customerId}
        />
      )}
    </div>
  );
};
