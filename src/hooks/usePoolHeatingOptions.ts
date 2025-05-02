
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HeatingInstallation } from "@/types/heating-installation";
import { BlanketRoller } from "@/types/blanket-roller";

export interface HeatPumpCompatibility {
  id: string;
  pool_range: string;
  pool_model: string;
  heat_pump_id: string;
  hp_sku: string;
  hp_description: string;
  rrp: number;
  trade: number;
  margin: number;
}

export const usePoolHeatingOptions = (
  poolId: string,
  poolModel: string,
  poolRange: string
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [compatibleHeatPump, setCompatibleHeatPump] = useState<HeatPumpCompatibility | null>(null);
  const [blanketRoller, setBlanketRoller] = useState<BlanketRoller | null>(null);
  const [heatingInstallations, setHeatingInstallations] = useState<HeatingInstallation[]>([]);

  useEffect(() => {
    const fetchHeatingOptions = async () => {
      setIsLoading(true);
      
      try {
        // Fetch matching heat pump for the pool model and range
        const { data: heatPumpData, error: heatPumpError } = await supabase
          .from("pool_heat_pump_compatibility")
          .select(`
            id, 
            pool_range, 
            pool_model,
            heat_pump_id,
            hp_details:heat_pumps(
              sku, 
              description, 
              trade, 
              margin, 
              rrp
            )
          `)
          .eq("pool_range", poolRange)
          .eq("pool_model", poolModel)
          .maybeSingle();

        if (heatPumpError) {
          console.error("Error fetching heat pump compatibility:", heatPumpError);
        } else if (heatPumpData) {
          setCompatibleHeatPump({
            id: heatPumpData.id,
            pool_range: heatPumpData.pool_range,
            pool_model: heatPumpData.pool_model,
            heat_pump_id: heatPumpData.heat_pump_id,
            hp_sku: heatPumpData.hp_details?.sku || "",
            hp_description: heatPumpData.hp_details?.description || "",
            rrp: heatPumpData.hp_details?.rrp || 0,
            trade: heatPumpData.hp_details?.trade || 0,
            margin: heatPumpData.hp_details?.margin || 0,
          });
        }

        // Fetch matching blanket and roller for the pool model and range
        const { data: blanketData, error: blanketError } = await supabase
          .from("blanket_rollers")
          .select("*")
          .eq("pool_range", poolRange)
          .eq("pool_model", poolModel)
          .maybeSingle();

        if (blanketError) {
          console.error("Error fetching blanket and roller:", blanketError);
        } else {
          setBlanketRoller(blanketData);
        }

        // Fetch installation costs
        const { data: installationsData, error: installationsError } = await supabase
          .from("heating_installations")
          .select("*");

        if (installationsError) {
          console.error("Error fetching heating installations:", installationsError);
        } else {
          // Fix the type issue by making sure the array elements match the HeatingInstallation interface
          const typedInstallations = installationsData.map((item: any) => ({
            id: item.id,
            installation_type: item.installation_type,
            installation_cost: item.installation_cost,
            installation_inclusions: item.installation_inclusions,
            created_at: item.created_at,
            updated_at: item.updated_at || undefined
          }));
          
          setHeatingInstallations(typedInstallations);
        }

      } catch (error) {
        console.error("Error fetching heating options:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (poolId && poolModel && poolRange) {
      fetchHeatingOptions();
    }
  }, [poolId, poolModel, poolRange]);

  const getInstallationCost = (installationType: string): number => {
    const installation = heatingInstallations.find(
      (item) => item.installation_type === installationType
    );
    return installation?.installation_cost || 0;
  };

  return {
    isLoading,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost,
  };
};
