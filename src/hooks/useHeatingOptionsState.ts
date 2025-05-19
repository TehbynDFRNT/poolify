import { HeatPumpCompatibility } from "@/hooks/usePoolHeatingOptions";
import { supabase } from "@/integrations/supabase/client";
import { BlanketRoller } from "@/types/blanket-roller";
import { PoolHeatingOptions } from "@/types/heating-options";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface UseHeatingOptionsStateProps {
  poolId: string | null;
  customerId: string | null;
  compatibleHeatPump: HeatPumpCompatibility | null;
  blanketRoller: BlanketRoller | null;
  getInstallationCost: (type: 'heat_pump' | 'blanket_roller') => number;
}

export function useHeatingOptionsState({
  poolId,
  customerId,
  compatibleHeatPump,
  blanketRoller,
  getInstallationCost
}: UseHeatingOptionsStateProps) {
  const [includeHeatPump, setIncludeHeatPump] = useState(false);
  const [includeBlanketRoller, setIncludeBlanketRoller] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // State for initially loaded costs from DB
  const [initialHeatPumpCost, setInitialHeatPumpCost] = useState<number>(0);
  const [initialBlanketRollerCost, setInitialBlanketRollerCost] = useState<number>(0);
  const [initialTotalCost, setInitialTotalCost] = useState<number>(0);
  const [heatingOptionsId, setHeatingOptionsId] = useState<string | null>(null);

  // Get the installation costs
  const heatPumpInstallationCost = getInstallationCost('heat_pump');
  const blanketRollerInstallationCost = getInstallationCost('blanket_roller');

  // Calculate costs based on CURRENT selections and product data (for dynamic updates)
  const currentHeatPumpProductCost = includeHeatPump && compatibleHeatPump
    ? (compatibleHeatPump.rrp || 0)
    : 0;

  const currentBlanketRollerProductCost = includeBlanketRoller && blanketRoller
    ? (blanketRoller.rrp || 0)
    : 0;

  // Total costs including installation
  const currentHeatPumpTotalCost = currentHeatPumpProductCost + (includeHeatPump ? heatPumpInstallationCost : 0);
  const currentBlanketRollerTotalCost = currentBlanketRollerProductCost + (includeBlanketRoller ? blanketRollerInstallationCost : 0);
  const currentTotalCost = currentHeatPumpTotalCost + currentBlanketRollerTotalCost;

  // Calculate margins based on CURRENT selections (if needed elsewhere)
  const currentHeatPumpMargin = includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin || 0 : 0;
  const currentBlanketRollerMargin = includeBlanketRoller && blanketRoller ? blanketRoller.margin || 0 : 0;
  const currentTotalMargin = currentHeatPumpMargin + currentBlanketRollerMargin;

  // Load existing selections AND COSTS from pool_heating_options table
  useEffect(() => {
    setIsLoadingProject(true);
    if (customerId && poolId) {
      fetchHeatingOptions();
    }
  }, [customerId, poolId]);

  const fetchHeatingOptions = async () => {
    if (!customerId || !poolId) return;
    setIsLoadingProject(true);
    try {
      // Fetch from pool_heating_options instead of pool_projects
      const { data, error } = await supabase
        .from('pool_heating_options')
        .select(`
          id,
          include_heat_pump,
          include_blanket_roller,
          heat_pump_id, 
          blanket_roller_id,
          heat_pump_cost, 
          blanket_roller_cost,
          heat_pump_installation_cost,
          blanket_roller_installation_cost,
          total_cost,
          total_margin
        `)
        .eq('customer_id', customerId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching heating options:", error);
        toast.error("Failed to load existing heating selections.");
        return;
      }

      if (data && data.length > 0) {
        // This cast might cause type errors if new fields don't exist in the result yet
        // Use a safer approach by checking if properties exist
        const heatingData = data[0] as any;

        // Store the ID for updates
        setHeatingOptionsId(heatingData.id);
        // Set include flags
        setIncludeHeatPump(heatingData.include_heat_pump ?? false);
        setIncludeBlanketRoller(heatingData.include_blanket_roller ?? false);
        // Set initial costs from DB
        setInitialHeatPumpCost(heatingData.heat_pump_cost ?? 0);
        setInitialBlanketRollerCost(heatingData.blanket_roller_cost ?? 0);
        setInitialTotalCost(heatingData.total_cost ?? 0);

        // Log the full data for debugging
        console.log('Loaded heating options data:', heatingData);
      } else {
        // If no data, reset initial costs
        setIncludeHeatPump(false);
        setIncludeBlanketRoller(false);
        setInitialHeatPumpCost(0);
        setInitialBlanketRollerCost(0);
        setInitialTotalCost(0);
        setHeatingOptionsId(null);
      }
    } catch (error) {
      console.error("Error fetching heating options:", error);
      toast.error("Failed to load existing heating selections.");
      // Reset costs on error
      setInitialHeatPumpCost(0);
      setInitialBlanketRollerCost(0);
      setInitialTotalCost(0);
      setHeatingOptionsId(null);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const saveHeatingOptions = async () => {
    if (!customerId || !poolId) {
      toast.error("Customer and pool information is required to save heating options");
      return;
    }
    setIsSaving(true);
    try {
      // Calculate costs TO BE SAVED based on current selections/prices
      const heatPumpProductCost = currentHeatPumpProductCost;
      const blanketRollerProductCost = currentBlanketRollerProductCost;
      const heatPumpInstallCostToSave = includeHeatPump ? heatPumpInstallationCost : 0;
      const blanketRollerInstallCostToSave = includeBlanketRoller ? blanketRollerInstallationCost : 0;
      const heatPumpCostToSave = currentHeatPumpTotalCost;
      const blanketRollerCostToSave = currentBlanketRollerTotalCost;
      const totalCostToSave = currentTotalCost;
      const totalMarginToSave = currentTotalMargin;

      // Log the values being saved
      console.log('Saving heating options:', {
        heatPumpProductCost,
        heatPumpInstallCost: heatPumpInstallCostToSave,
        heatPumpTotalCost: heatPumpCostToSave,
        blanketRollerProductCost,
        blanketRollerInstallCost: blanketRollerInstallCostToSave,
        blanketRollerTotalCost: blanketRollerCostToSave,
        totalCost: totalCostToSave
      });

      let result;
      if (heatingOptionsId) {
        // Update existing record
        const updateData: Partial<PoolHeatingOptions> = {
          include_heat_pump: includeHeatPump,
          include_blanket_roller: includeBlanketRoller,
          heat_pump_id: includeHeatPump && compatibleHeatPump ? compatibleHeatPump.heat_pump_id : null,
          blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
          heat_pump_cost: heatPumpCostToSave,
          blanket_roller_cost: blanketRollerCostToSave,
          heat_pump_installation_cost: heatPumpInstallCostToSave,
          blanket_roller_installation_cost: blanketRollerInstallCostToSave,
          total_cost: totalCostToSave,
          total_margin: totalMarginToSave
        };

        result = await supabase
          .from('pool_heating_options')
          .update(updateData)
          .eq('id', heatingOptionsId);
      } else {
        // Create new record - must include required fields
        const insertData = {
          customer_id: customerId,
          pool_id: poolId,
          include_heat_pump: includeHeatPump,
          include_blanket_roller: includeBlanketRoller,
          heat_pump_id: includeHeatPump && compatibleHeatPump ? compatibleHeatPump.heat_pump_id : null,
          blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
          heat_pump_cost: heatPumpCostToSave,
          blanket_roller_cost: blanketRollerCostToSave,
          heat_pump_installation_cost: heatPumpInstallCostToSave,
          blanket_roller_installation_cost: blanketRollerInstallCostToSave,
          total_cost: totalCostToSave,
          total_margin: totalMarginToSave
        };

        result = await supabase
          .from('pool_heating_options')
          .insert(insertData);
      }

      if (result.error) {
        console.error("Error saving heating options:", result.error);
        throw result.error;
      }

      // After successful save, update the 'initial' costs to match what was just saved
      setInitialHeatPumpCost(heatPumpCostToSave);
      setInitialBlanketRollerCost(blanketRollerCostToSave);
      setInitialTotalCost(totalCostToSave);

      // If this was a new record, fetch to get the new ID
      if (!heatingOptionsId) {
        await fetchHeatingOptions();
      }

      toast.success("Heating options saved successfully");

    } catch (error) {
      toast.error("Failed to save heating options");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading: isLoadingProject,
    includeHeatPump,
    setIncludeHeatPump,
    includeBlanketRoller,
    setIncludeBlanketRoller,
    isSaving,
    saveHeatingOptions,
    // Return both initial (fetched) and current (recalculated) costs
    initialHeatPumpCost,
    initialBlanketRollerCost,
    initialTotalCost,
    currentHeatPumpTotalCost,
    currentBlanketRollerTotalCost,
    currentTotalCost,
    currentTotalMargin,
    currentHeatPumpMargin,
    currentBlanketRollerMargin
  };
}
