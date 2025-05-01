
import React from "react";
import { Pool } from "@/types/pool";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { useHeatingOptionsState } from "@/hooks/useHeatingOptionsState";
import { HeatPumpSection } from "./HeatPumpSection";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { HeatingOptionsSummary } from "./HeatingOptionsSummary";
import { Loader2, Thermometer, Scroll, Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PoolCleanersContent } from "../pool-cleaners/PoolCleanersContent";

interface HeatingOptionsContentProps {
  pool: Pool;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId
}) => {
  const { isLoading, compatibleHeatPump, blanketRoller, getInstallationCost } = usePoolHeatingOptions(
    pool.id,
    pool.name, // Using name instead of model which doesn't exist on Pool type
    pool.range
  );

  const heatPumpInstallationCost = getInstallationCost("Heat Pump");
  const blanketRollerInstallationCost = getInstallationCost("Blanket Roller");

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
    totalMargin,
    heatPumpMargin,
    blanketRollerMargin
  } = useHeatingOptionsState({
    poolId: pool.id,
    customerId,
    compatibleHeatPump,
    blanketRoller,
    heatPumpInstallationCost,
    blanketRollerInstallationCost
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="ml-2">Loading heating options...</span>
      </div>
    );
  }

  return (
    <Tabs defaultValue="heating" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="heating" className="flex items-center gap-2">
          <Thermometer className="h-4 w-4" />
          <span>Heating Options</span>
        </TabsTrigger>
        <TabsTrigger value="cleaners" className="flex items-center gap-2">
          <Waves className="h-4 w-4" />
          <span>Pool Cleaners</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="heating" className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-6">
            Explore heating options to extend your swimming season and enhance your pool experience.
            Our experts have selected compatible options for your specific pool model.
          </p>
        </div>
        
        <HeatPumpSection
          includeHeatPump={includeHeatPump}
          setIncludeHeatPump={setIncludeHeatPump}
          compatibleHeatPump={compatibleHeatPump}
          installationCost={heatPumpInstallationCost}
          totalCost={heatPumpTotalCost}
        />
        
        <BlanketRollerSection
          includeBlanketRoller={includeBlanketRoller}
          setIncludeBlanketRoller={setIncludeBlanketRoller}
          blanketRoller={blanketRoller}
          installationCost={blanketRollerInstallationCost}
          totalCost={blanketRollerTotalCost}
        />
        
        <HeatingOptionsSummary
          totalCost={totalCost}
          totalMargin={totalMargin}
          isSaving={isSaving}
          onSave={saveHeatingOptions}
          customerId={customerId}
        />
        
        {customerId && (
          <div className="flex justify-end mt-6">
            <Button 
              onClick={saveHeatingOptions} 
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Heating Options
            </Button>
          </div>
        )}
      </TabsContent>
      
      <TabsContent value="cleaners" className="space-y-6">
        <PoolCleanersContent pool={pool} customerId={customerId} />
      </TabsContent>
    </Tabs>
  );
};
