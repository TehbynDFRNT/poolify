import { Button } from "@/components/ui/button";
import { useHeatingOptionsStateGuarded } from "@/hooks/useHeatingOptionsStateGuarded";
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

  console.log('Installation costs:', {
    heatPump: heatPumpInstallCost,
    blanketRoller: blanketRollerInstallCost
  });

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
    currentHeatPumpTotalCost,
    currentBlanketRollerTotalCost,
    currentTotalCost,
    currentTotalMargin,
    StatusWarningDialog
  } = useHeatingOptionsStateGuarded({
    poolId: pool.id,
    customerId,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost: (type) => {
      if (type === 'heat_pump') return heatPumpInstallCost;
      if (type === 'blanket_roller') return blanketRollerInstallCost;
      return 0;
    }
  });

  console.log('Calculated costs:', {
    heatPump: currentHeatPumpTotalCost,
    blanketRoller: currentBlanketRollerTotalCost,
    total: currentTotalCost
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
        totalCost={currentHeatPumpTotalCost || initialHeatPumpCost}
        margin={includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin : 0}
      />

      <BlanketRollerSection
        blanketRoller={blanketRoller}
        includeBlanketRoller={includeBlanketRoller}
        setIncludeBlanketRoller={setIncludeBlanketRoller}
        installationCost={blanketRollerInstallCost}
        totalCost={currentBlanketRollerTotalCost || initialBlanketRollerCost}
        margin={includeBlanketRoller && blanketRoller ? blanketRoller.margin : 0}
      />

      <HeatingOptionsSummary
        includeHeatPump={includeHeatPump}
        includeBlanketRoller={includeBlanketRoller}
        totalCost={currentTotalCost}
        totalMargin={currentTotalMargin}
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

      {/* Status Warning Dialog */}
      <StatusWarningDialog />
    </div>
  );
};
