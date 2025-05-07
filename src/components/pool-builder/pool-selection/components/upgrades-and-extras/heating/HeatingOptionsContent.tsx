import { Button } from "@/components/ui/button";
import { useHeatingOptionsState } from "@/hooks/useHeatingOptionsState";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { Pool } from "@/types/pool";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { HeatingOptionsSummary } from "./HeatingOptionsSummary";
import { HeatPumpSection } from "./HeatPumpSection";

interface HeatingOptionsContentProps {
  pool: Pool;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId
}) => {
  const {
    isLoading: isLoadingBaseOptions,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost
  } = usePoolHeatingOptions(pool.id, pool.name || "", pool.range);

  const heatPumpInstallCost = getInstallationCost('heat_pump');
  const blanketRollerInstallCost = getInstallationCost('blanket_roller');

  const {
    isLoading: isLoadingSelections,
    includeHeatPump,
    setIncludeHeatPump,
    includeBlanketRoller,
    setIncludeBlanketRoller,
    isSaving,
    saveHeatingOptions,
    initialHeatPumpCost,
    initialBlanketRollerCost,
    currentTotalCost,
  } = useHeatingOptionsState({
    poolId: pool.id,
    customerId,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost: getInstallationCost
  });

  const isLoading = isLoadingBaseOptions || isLoadingSelections;

  useEffect(() => {
    if (!isLoadingBaseOptions) {
      if (!compatibleHeatPump && includeHeatPump) {
        setIncludeHeatPump(false);
      }
    }
  }, [isLoadingBaseOptions, compatibleHeatPump, includeHeatPump, setIncludeHeatPump]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading heating options...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground mb-6">
        Choose from our range of heating solutions to extend your swimming season.
        Our options include energy-efficient heat pumps and solar blankets to maintain
        your pool temperature while reducing energy costs.
      </p>

      <HeatPumpSection
        compatibleHeatPump={compatibleHeatPump}
        includeHeatPump={includeHeatPump}
        setIncludeHeatPump={setIncludeHeatPump}
        installationCost={heatPumpInstallCost}
        totalCost={initialHeatPumpCost}
      />

      <BlanketRollerSection
        blanketRoller={blanketRoller}
        includeBlanketRoller={includeBlanketRoller}
        setIncludeBlanketRoller={setIncludeBlanketRoller}
        installationCost={blanketRollerInstallCost}
        totalCost={initialBlanketRollerCost}
      />

      <HeatingOptionsSummary
        includeHeatPump={includeHeatPump}
        includeBlanketRoller={includeBlanketRoller}
        totalCost={currentTotalCost}
      />

      {customerId && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={saveHeatingOptions}
            disabled={isSaving || isLoading}
            className="flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {isSaving ? 'Saving...' : 'Save Heating Options'}
          </Button>
        </div>
      )}
    </div>
  );
};
