import { Button } from "@/components/ui/button";
import { useHeatingOptionsStateGuarded } from "@/hooks/useHeatingOptionsStateGuarded";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { Pool } from "@/types/pool";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { HeatingOptionsSummary } from "./HeatingOptionsSummary";
import { HeatPumpSection } from "./HeatPumpSection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface HeatingOptionsContentProps {
  pool: Pool;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId
}) => {
  const queryClient = useQueryClient();
  
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

  // Auto-save effect with direct Supabase calls
  useEffect(() => {
    if (!customerId || !pool.id || isLoading || isLoadingBaseOptions) return;

    const timer = setTimeout(async () => {
      try {
        console.log('🔄 Auto-saving heating options...');
        
        // Handle heat pump selection
        if (includeHeatPump && compatibleHeatPump) {
          const heatPumpTotal = compatibleHeatPump.rrp + heatPumpInstallCost;
          const blanketRollerTotal = includeBlanketRoller && blanketRoller ? blanketRoller.rrp + blanketRollerInstallCost : 0;
          const totalCost = heatPumpTotal + blanketRollerTotal;
          const totalMargin = compatibleHeatPump.margin + (includeBlanketRoller && blanketRoller ? blanketRoller.margin : 0);
          
          await supabase
            .from('pool_heating_options')
            .upsert({
              customer_id: customerId,
              pool_id: pool.id,
              heat_pump_id: compatibleHeatPump.id,
              heat_pump_cost: heatPumpTotal,
              heat_pump_installation_cost: heatPumpInstallCost,
              include_heat_pump: true,
              include_blanket_roller: includeBlanketRoller,
              blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
              blanket_roller_cost: includeBlanketRoller && blanketRoller ? blanketRollerTotal : 0,
              blanket_roller_installation_cost: includeBlanketRoller ? blanketRollerInstallCost : null,
              total_cost: totalCost,
              total_margin: totalMargin
            });
        } else if (includeBlanketRoller && blanketRoller) {
          // Only blanket roller selected
          const blanketRollerTotal = blanketRoller.rrp + blanketRollerInstallCost;
          const totalCost = blanketRollerTotal;
          const totalMargin = blanketRoller.margin;
          
          await supabase
            .from('pool_heating_options')
            .upsert({
              customer_id: customerId,
              pool_id: pool.id,
              include_heat_pump: false,
              heat_pump_id: null,
              heat_pump_cost: 0,
              heat_pump_installation_cost: null,
              include_blanket_roller: true,
              blanket_roller_id: blanketRoller.id,
              blanket_roller_cost: blanketRollerTotal,
              blanket_roller_installation_cost: blanketRollerInstallCost,
              total_cost: totalCost,
              total_margin: totalMargin
            });
        } else {
          // Nothing selected - delete any existing record
          await supabase
            .from('pool_heating_options')
            .delete()
            .eq('customer_id', customerId);
        }

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({ queryKey: ['pool-heating-options', customerId] });
        console.log('✅ Heating options auto-saved successfully');
      } catch (error) {
        console.error("Error auto-saving heating options:", error);
        toast.error("Failed to auto-save heating options");
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    includeHeatPump,
    includeBlanketRoller,
    customerId,
    pool.id,
    heatPumpInstallCost,
    blanketRollerInstallCost,
    isLoadingBaseOptions
  ]);

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
        heatPumpCost={currentHeatPumpTotalCost}
        heatPumpMargin={includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin : 0}
        blanketRollerCost={currentBlanketRollerTotalCost}
        blanketRollerMargin={includeBlanketRoller && blanketRoller ? blanketRoller.margin : 0}
        totalCost={currentTotalCost}
        totalMargin={currentTotalMargin}
      />

      {/* Status Warning Dialog */}
      <StatusWarningDialog />
    </div>
  );
};
