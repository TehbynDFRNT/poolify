
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HeatingInstallation } from "@/types/heating-options";

export interface HeatPumpCompatibility {
  id: string;
  heat_pump_id: string;
  pool_model: string;
  pool_range: string;
  hp_description: string;
  hp_sku: string;
  rrp?: number;
  margin?: number;
  created_at: string;
  updated_at: string;
}

export interface BlanketRoller {
  id: string;
  pool_model: string;
  pool_range: string;
  description: string;
  sku: string;
  trade: number;
  margin: number;
  rrp: number;
  created_at: string;
}

export const usePoolHeatingOptions = (
  poolId: string | null,
  poolModel?: string,
  poolRange?: string
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [compatibleHeatPump, setCompatibleHeatPump] = useState<HeatPumpCompatibility | null>(null);
  const [blanketRoller, setBlanketRoller] = useState<BlanketRoller | null>(null);
  const [installationOptions, setInstallationOptions] = useState<HeatingInstallation[]>([]);

  // Fetch heating options based on pool model
  useEffect(() => {
    if (!poolModel || !poolRange) {
      setIsLoading(false);
      return;
    }

    const fetchHeatingOptions = async () => {
      setIsLoading(true);
      try {
        // Fetch compatible heat pump with explicit fields selection
        const { data: heatPumpData, error: heatPumpError } = await supabase
          .from("heat_pump_pool_compatibility")
          .select("*, heat_pump_products(cost, rrp, margin)")
          .eq("pool_model", poolModel)
          .eq("pool_range", poolRange)
          .single();

        if (heatPumpError) {
          // Only log if it's not a "no rows returned" error
          if (heatPumpError.code !== 'PGRST116') {
            console.error("Error fetching heat pump compatibility:", heatPumpError);
          }
          setCompatibleHeatPump(null);
        } else if (heatPumpData) {
          // Format the data to include pricing info from heat pump products
          const formattedHeatPump: HeatPumpCompatibility = {
            id: heatPumpData.id,
            heat_pump_id: heatPumpData.heat_pump_id,
            pool_model: heatPumpData.pool_model,
            pool_range: heatPumpData.pool_range,
            hp_description: heatPumpData.hp_description,
            hp_sku: heatPumpData.hp_sku,
            created_at: heatPumpData.created_at,
            updated_at: heatPumpData.updated_at,
            rrp: heatPumpData.heat_pump_products?.rrp,
            margin: heatPumpData.heat_pump_products?.margin
          };
          
          setCompatibleHeatPump(formattedHeatPump);
        }

        // Fetch blanket roller
        const { data: blanketRollerData, error: blanketRollerError } = await supabase
          .from("blanket_rollers")
          .select("*")
          .eq("pool_model", poolModel)
          .eq("pool_range", poolRange)
          .single();

        if (blanketRollerError) {
          if (blanketRollerError.code !== 'PGRST116') {
            console.error("Error fetching blanket roller:", blanketRollerError);
          }
        }
        
        // Fetch installation options
        const { data: installationData, error: installationError } = await supabase
          .from("heating_installations")
          .select("*");
          
        if (installationError) {
          console.error("Error fetching installation options:", installationError);
        }

        setBlanketRoller(blanketRollerData);
        setInstallationOptions(installationData || []);
      } catch (error) {
        console.error("Error in usePoolHeatingOptions:", error);
        setCompatibleHeatPump(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeatingOptions();
  }, [poolModel, poolRange]);

  // Helper function to get installation cost based on type
  const getInstallationCost = (installationType: string): number => {
    const option = installationOptions.find(opt => opt.installation_type === installationType);
    return option ? option.installation_cost : 0;
  };

  return {
    isLoading,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost,
  };
};
