
import React, { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { usePoolHeatingOptions } from "@/hooks/usePoolHeatingOptions";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { HeatingOptionsSummary } from "./HeatingOptionsSummary";
import { HeatPumpSection } from "./HeatPumpSection";
import { BlanketRollerSection } from "./BlanketRollerSection";
import { formatCurrency } from "@/utils/format";

interface HeatingOptionsContentProps {
  pool: Pool;
  customerId: string | null;
}

export const HeatingOptionsContent: React.FC<HeatingOptionsContentProps> = ({
  pool,
  customerId,
}) => {
  const [includeHeatPump, setIncludeHeatPump] = useState(false);
  const [includeBlanketRoller, setIncludeBlanketRoller] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { compatibleHeatPump, blanketRoller, getInstallationCost } = usePoolHeatingOptions(
    pool.id,
    pool.name,
    pool.range || ""
  );

  // Calculate the total costs
  const heatPumpInstallationCost = includeHeatPump ? getInstallationCost("Heat Pump") : 0;
  const blanketRollerInstallationCost = includeBlanketRoller ? getInstallationCost("Blanket & Roller") : 0;
  
  const heatPumpTotalCost = includeHeatPump && compatibleHeatPump 
    ? compatibleHeatPump.rrp + heatPumpInstallationCost
    : 0;
    
  const blanketRollerTotalCost = includeBlanketRoller && blanketRoller 
    ? blanketRoller.rrp + blanketRollerInstallationCost
    : 0;
    
  const totalCost = heatPumpTotalCost + blanketRollerTotalCost;
  
  // Calculate the total margin
  const heatPumpMargin = includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin : 0;
  const blanketRollerMargin = includeBlanketRoller && blanketRoller ? blanketRoller.margin : 0;
  const totalMargin = heatPumpMargin + blanketRollerMargin;

  // Fetch existing options on component mount
  useEffect(() => {
    const fetchExistingOptions = async () => {
      if (!customerId || !pool.id) return;

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("pool_heating_options")
          .select("*")
          .eq("customer_id", customerId)
          .eq("pool_id", pool.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setIncludeHeatPump(data.include_heat_pump);
          setIncludeBlanketRoller(data.include_blanket_roller);
        }
      } catch (error) {
        console.error("Error fetching heating options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingOptions();
  }, [customerId, pool.id]);

  const saveHeatingOptions = async () => {
    if (!customerId || !pool.id) return;

    setIsSaving(true);
    try {
      const payload = {
        customer_id: customerId,
        pool_id: pool.id,
        include_heat_pump: includeHeatPump,
        include_blanket_roller: includeBlanketRoller,
        heat_pump_id: includeHeatPump && compatibleHeatPump ? compatibleHeatPump.heat_pump_id : null,
        blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
        heat_pump_cost: heatPumpTotalCost,
        blanket_roller_cost: blanketRollerTotalCost,
        total_cost: totalCost,
        total_margin: totalMargin,
      };

      // Check if a record already exists
      const { data: existing, error: checkError } = await supabase
        .from("pool_heating_options")
        .select("id")
        .eq("customer_id", customerId)
        .eq("pool_id", pool.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("pool_heating_options")
          .update(payload)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("pool_heating_options")
          .insert(payload);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Heating options saved successfully",
      });
    } catch (error) {
      console.error("Error saving heating options:", error);
      toast({
        title: "Error",
        description: "Failed to save heating options",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

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
      <h3 className="text-lg font-medium">Heating Options</h3>
      
      <p className="text-sm text-muted-foreground">
        Extend your swimming season with our heating options. Choose from heat pumps and solar blankets to maintain 
        comfortable water temperature and reduce energy costs.
      </p>

      <HeatPumpSection
        compatibleHeatPump={compatibleHeatPump}
        includeHeatPump={includeHeatPump}
        setIncludeHeatPump={setIncludeHeatPump}
        installationCost={heatPumpInstallationCost}
      />

      <BlanketRollerSection
        blanketRoller={blanketRoller}
        includeBlanketRoller={includeBlanketRoller}
        setIncludeBlanketRoller={setIncludeBlanketRoller}
        installationCost={blanketRollerInstallationCost}
      />

      <HeatingOptionsSummary 
        compatibleHeatPump={compatibleHeatPump}
        blanketRoller={blanketRoller}
        includeHeatPump={includeHeatPump}
        includeBlanketRoller={includeBlanketRoller}
        heatPumpInstallationCost={heatPumpInstallationCost}
        blanketRollerInstallationCost={blanketRollerInstallationCost}
        totalCost={totalCost}
      />

      {customerId && (
        <div className="flex justify-end mt-6">
          <Button
            onClick={saveHeatingOptions}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSaving ? "Saving..." : "Save Heating Options"}
          </Button>
        </div>
      )}
    </div>
  );
};
