
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PoolHeatingOptions } from "@/types/heating-options";
import { toast } from "sonner";
import { HeatPumpCompatibility } from "@/hooks/usePoolHeatingOptions";
import { BlanketRoller } from "@/types/blanket-roller";

interface UseHeatingOptionsStateProps {
  poolId: string | null;
  customerId: string | null;
  compatibleHeatPump: HeatPumpCompatibility | null;
  blanketRoller: BlanketRoller | null;
  heatPumpInstallationCost: number;
  blanketRollerInstallationCost: number;
}

export function useHeatingOptionsState({
  poolId,
  customerId,
  compatibleHeatPump,
  blanketRoller,
  heatPumpInstallationCost,
  blanketRollerInstallationCost
}: UseHeatingOptionsStateProps) {
  const [includeHeatPump, setIncludeHeatPump] = useState(false);
  const [includeBlanketRoller, setIncludeBlanketRoller] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate costs
  const heatPumpTotalCost = includeHeatPump && compatibleHeatPump 
    ? (compatibleHeatPump.rrp || 0) + heatPumpInstallationCost
    : 0;

  const blanketRollerTotalCost = includeBlanketRoller && blanketRoller
    ? blanketRoller.rrp + blanketRollerInstallationCost
    : 0;

  const totalCost = heatPumpTotalCost + blanketRollerTotalCost;
  
  // Calculate margins
  const heatPumpMargin = includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin || 0 : 0;
  const blanketRollerMargin = includeBlanketRoller && blanketRoller ? blanketRoller.margin || 0 : 0;
  const totalMargin = heatPumpMargin + blanketRollerMargin;

  // Load existing selections when component mounts
  useEffect(() => {
    if (customerId && poolId) {
      fetchHeatingOptions();
    }
  }, [customerId, poolId]);

  const fetchHeatingOptions = async () => {
    if (!customerId || !poolId) return;
    
    try {
      const { data, error } = await supabase
        .from('pool_heating_options')
        .select('*')
        .eq('customer_id', customerId)
        .eq('pool_id', poolId)
        .maybeSingle();
        
      if (error) {
        console.error("Error fetching heating options:", error);
        return;
      }
      
      if (data) {
        const heatingOptions = data as PoolHeatingOptions;
        setIncludeHeatPump(heatingOptions.include_heat_pump);
        setIncludeBlanketRoller(heatingOptions.include_blanket_roller);
      }
    } catch (error) {
      console.error("Error fetching heating options:", error);
    }
  };

  const saveHeatingOptions = async () => {
    if (!customerId || !poolId) {
      toast.error("Customer information is required to save heating options");
      return;
    }
    
    setIsSaving(true);
    
    try {
      const heatingOptionsData = {
        customer_id: customerId,
        pool_id: poolId,
        include_heat_pump: includeHeatPump,
        include_blanket_roller: includeBlanketRoller,
        heat_pump_id: includeHeatPump && compatibleHeatPump ? compatibleHeatPump.heat_pump_id : null,
        blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
        heat_pump_cost: heatPumpTotalCost,
        blanket_roller_cost: blanketRollerTotalCost,
        total_cost: totalCost,
        total_margin: totalMargin
      };
      
      // Check if a record already exists
      const { data: existingData, error: fetchError } = await supabase
        .from('pool_heating_options')
        .select('id')
        .eq('customer_id', customerId)
        .eq('pool_id', poolId)
        .maybeSingle();
        
      if (fetchError) {
        console.error("Error checking existing data:", fetchError);
        throw fetchError;
      }
      
      let error;
      
      if (existingData?.id) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('pool_heating_options')
          .update(heatingOptionsData)
          .eq('id', existingData.id);
          
        error = updateError;
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('pool_heating_options')
          .insert(heatingOptionsData);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast.success("Heating options saved successfully");
    } catch (error) {
      console.error("Error saving heating options:", error);
      toast.error("Failed to save heating options");
    } finally {
      setIsSaving(false);
    }
  };

  return {
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
  };
}
