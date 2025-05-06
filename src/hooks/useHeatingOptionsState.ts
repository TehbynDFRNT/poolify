import { HeatPumpCompatibility } from "@/hooks/usePoolHeatingOptions";
import { supabase } from "@/integrations/supabase/client";
import { BlanketRoller } from "@/types/blanket-roller";
import { PoolProject } from "@/types/pool";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const [isLoadingProject, setIsLoadingProject] = useState(true);

  // State for initially loaded costs from DB
  const [initialHeatPumpCost, setInitialHeatPumpCost] = useState<number>(0);
  const [initialBlanketRollerCost, setInitialBlanketRollerCost] = useState<number>(0);
  const [initialTotalCost, setInitialTotalCost] = useState<number>(0);

  // Calculate costs based on CURRENT selections and product data (for dynamic updates)
  const currentHeatPumpTotalCost = includeHeatPump && compatibleHeatPump
    ? (compatibleHeatPump.rrp || 0) + heatPumpInstallationCost
    : 0;

  const currentBlanketRollerTotalCost = includeBlanketRoller && blanketRoller
    ? (blanketRoller.rrp || 0) + blanketRollerInstallationCost
    : 0;

  const currentTotalCost = currentHeatPumpTotalCost + currentBlanketRollerTotalCost;

  // Calculate margins based on CURRENT selections (if needed elsewhere)
  const currentHeatPumpMargin = includeHeatPump && compatibleHeatPump ? compatibleHeatPump.margin || 0 : 0;
  const currentBlanketRollerMargin = includeBlanketRoller && blanketRoller ? blanketRoller.margin || 0 : 0;
  const currentTotalMargin = currentHeatPumpMargin + currentBlanketRollerMargin;

  // Load existing selections AND COSTS from pool_projects table
  useEffect(() => {
    setIsLoadingProject(true);
    if (customerId) {
      fetchHeatingOptions();
    }
  }, [customerId]);

  const fetchHeatingOptions = async () => {
    if (!customerId) return;
    setIsLoadingProject(true);
    try {
      // Fetch relevant fields including costs from pool_projects
      const { data, error } = await supabase
        .from('pool_projects')
        .select(`
          include_heat_pump,
          include_blanket_roller,
          heat_pump_cost, 
          blanket_roller_cost,
          heating_total_cost
        `)
        .eq('id', customerId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching project heating options:", error);
        toast.error("Failed to load existing heating selections.");
        return;
      }

      if (data) {
        const projectData = data as unknown as Partial<PoolProject>;
        // Set include flags
        setIncludeHeatPump(projectData.include_heat_pump ?? false);
        setIncludeBlanketRoller(projectData.include_blanket_roller ?? false);
        // Set initial costs from DB
        setInitialHeatPumpCost(projectData.heat_pump_cost ?? 0);
        setInitialBlanketRollerCost(projectData.blanket_roller_cost ?? 0);
        setInitialTotalCost(projectData.heating_total_cost ?? 0);
      } else {
        // If no data, reset initial costs
        setInitialHeatPumpCost(0);
        setInitialBlanketRollerCost(0);
        setInitialTotalCost(0);
      }
    } catch (error) {
      console.error("Error fetching project heating options:", error);
      toast.error("Failed to load existing heating selections.");
      // Reset costs on error too?
      setInitialHeatPumpCost(0);
      setInitialBlanketRollerCost(0);
      setInitialTotalCost(0);
    } finally {
      setIsLoadingProject(false);
    }
  };

  const saveHeatingOptions = async () => {
    if (!customerId) {
      toast.error("Customer information is required to save heating options");
      return;
    }
    setIsSaving(true);
    try {
      // Calculate costs TO BE SAVED based on current selections/prices
      const heatPumpCostToSave = currentHeatPumpTotalCost;
      const blanketRollerCostToSave = currentBlanketRollerTotalCost;
      const totalCostToSave = currentTotalCost;
      const totalMarginToSave = currentTotalMargin; // Calculate margin to save

      const projectUpdateData: Partial<PoolProject> = {
        include_heat_pump: includeHeatPump,
        include_blanket_roller: includeBlanketRoller,
        heat_pump_id: includeHeatPump && compatibleHeatPump ? compatibleHeatPump.heat_pump_id : null,
        blanket_roller_id: includeBlanketRoller && blanketRoller ? blanketRoller.id : null,
        // Save the newly calculated costs
        heat_pump_cost: heatPumpCostToSave,
        blanket_roller_cost: blanketRollerCostToSave,
        heating_total_cost: totalCostToSave,
        heating_total_margin: totalMarginToSave
      };

      const { error } = await supabase
        .from('pool_projects')
        .update(projectUpdateData)
        .eq('id', customerId);

      if (error) {
        console.error("Error updating pool_projects with heating options:", error);
        throw error;
      }

      // After successful save, update the 'initial' costs to match what was just saved
      setInitialHeatPumpCost(heatPumpCostToSave);
      setInitialBlanketRollerCost(blanketRollerCostToSave);
      setInitialTotalCost(totalCostToSave);

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
