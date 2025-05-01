
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { HeatPumpCompatibility } from "@/hooks/useHeatPumpCompatibility";
import { BlanketRoller } from "@/types/blanket-roller";
import { useHeatPumpProducts } from "@/hooks/useHeatPumpProducts";
import { HeatingInstallation } from "@/types/heating-installation";

export const usePoolHeatingOptions = (poolId: string | null, poolModel?: string, poolRange?: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [heatingInstallations, setHeatingInstallations] = useState<HeatingInstallation[]>([]);
  const [compatibleHeatPump, setCompatibleHeatPump] = useState<HeatPumpCompatibility | null>(null);
  const [blanketRoller, setBlanketRoller] = useState<BlanketRoller | null>(null);
  const { toast } = useToast();
  
  // Get heat pump products data to ensure we have pricing information
  const { heatPumpProducts, isLoading: isLoadingHeatPumpProducts, fetchHeatPumpProducts } = useHeatPumpProducts();

  useEffect(() => {
    // Only fetch data if we have a poolId
    if (!poolId) {
      setIsLoading(false);
      return;
    }
    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch heating installations
        const { data: installationsData, error: installationsError } = await supabase
          .from("heating_installations")
          .select("*");
        
        if (installationsError) throw installationsError;
        setHeatingInstallations(installationsData || []);

        // Fetch heat pump products to ensure we have pricing data available
        await fetchHeatPumpProducts();
        
        // Only fetch compatibility and blanket roller if we have pool model and range
        if (poolModel && poolRange) {
          // Fetch compatible heat pump for this pool
          const { data: heatPumpData, error: heatPumpError } = await supabase
            .from("heat_pump_pool_compatibility")
            .select(`
              *,
              heat_pump_products(cost, rrp, margin)
            `)
            .eq("pool_model", poolModel)
            .eq("pool_range", poolRange)
            .order("created_at", { ascending: false })
            .limit(1);

          if (heatPumpError) throw heatPumpError;
          
          if (heatPumpData && heatPumpData.length > 0) {
            const heatPumpItem = {
              ...heatPumpData[0],
              cost: heatPumpData[0].heat_pump_products?.cost,
              rrp: heatPumpData[0].heat_pump_products?.rrp,
              margin: heatPumpData[0].heat_pump_products?.margin,
              heat_pump_products: undefined
            } as HeatPumpCompatibility;
            
            setCompatibleHeatPump(heatPumpItem);
          }

          // Fetch compatible blanket & roller for this pool
          const { data: blanketData, error: blanketError } = await supabase
            .from("blanket_rollers")
            .select("*")
            .eq("pool_model", poolModel)
            .eq("pool_range", poolRange)
            .order("created_at", { ascending: false })
            .limit(1);

          if (blanketError) throw blanketError;
          
          if (blanketData && blanketData.length > 0) {
            setBlanketRoller(blanketData[0] as BlanketRoller);
          }
        }
      } catch (error: any) {
        console.error("Error fetching pool heating options:", error);
        toast({
          title: "Error loading heating options",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [poolId, poolModel, poolRange]);

  // Helper function to get installation cost by type
  const getInstallationCost = (type: string): number => {
    const installation = heatingInstallations.find(
      (item) => item.installation_type.toLowerCase() === type.toLowerCase()
    );
    return installation?.installation_cost || 0;
  };

  return {
    isLoading,
    heatingInstallations,
    compatibleHeatPump,
    blanketRoller,
    getInstallationCost,
  };
};
