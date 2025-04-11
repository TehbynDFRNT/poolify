
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HeatPumpPoolCompatibility } from "@/pages/Quotes/components/SiteRequirementsStep/types";

export const useHeatPumpCompatibility = (heatPumpId?: string) => {
  const [compatibilities, setCompatibilities] = useState<HeatPumpPoolCompatibility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // For now, we'll use local data based on the provided table since we don't have a database table yet
  const fetchCompatibilities = async (hpSkuFilter?: string) => {
    // This is a local dataset for initial implementation
    const localData: HeatPumpPoolCompatibility[] = [
      // Piazza range
      { id: "1", heat_pump_id: "hp1", pool_range: "Piazza", pool_model: "Alto", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "2", heat_pump_id: "hp1", pool_range: "Piazza", pool_model: "Latina", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "3", heat_pump_id: "hp1", pool_range: "Piazza", pool_model: "Sovereign", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "4", heat_pump_id: "hp2", pool_range: "Piazza", pool_model: "Empire", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "5", heat_pump_id: "hp2", pool_range: "Piazza", pool_model: "Oxford", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "6", heat_pump_id: "hp2", pool_range: "Piazza", pool_model: "Avellino", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "7", heat_pump_id: "hp2", pool_range: "Piazza", pool_model: "Palazzo", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "8", heat_pump_id: "hp3", pool_range: "Piazza", pool_model: "Valentina", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
      { id: "9", heat_pump_id: "hp3", pool_range: "Piazza", pool_model: "Westminster", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
      { id: "10", heat_pump_id: "hp4", pool_range: "Piazza", pool_model: "Kensington", hp_sku: "IX24", hp_description: "Sunlover Oasis 24kW Heat Pump" },
      
      // Latin range
      { id: "11", heat_pump_id: "hp1", pool_range: "Latin", pool_model: "Verona", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "12", heat_pump_id: "hp1", pool_range: "Latin", pool_model: "Portofino", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "13", heat_pump_id: "hp1", pool_range: "Latin", pool_model: "Florentina", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "14", heat_pump_id: "hp2", pool_range: "Latin", pool_model: "Bellagio", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      
      // Contemporary range
      { id: "15", heat_pump_id: "hp2", pool_range: "Contemporary", pool_model: "Bellino", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "16", heat_pump_id: "hp2", pool_range: "Contemporary", pool_model: "Imperial", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "17", heat_pump_id: "hp2", pool_range: "Contemporary", pool_model: "Castello", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "18", heat_pump_id: "hp3", pool_range: "Contemporary", pool_model: "Grandeur", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
      { id: "19", heat_pump_id: "hp3", pool_range: "Contemporary", pool_model: "Amalfi", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
      
      // Vogue range
      { id: "20", heat_pump_id: "hp1", pool_range: "Vogue", pool_model: "Serenity", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "21", heat_pump_id: "hp1", pool_range: "Vogue", pool_model: "Allure", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "22", heat_pump_id: "hp2", pool_range: "Vogue", pool_model: "Harmony", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      
      // Villa range
      { id: "23", heat_pump_id: "hp2", pool_range: "Villa", pool_model: "Istana", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "24", heat_pump_id: "hp2", pool_range: "Villa", pool_model: "Terazza", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "25", heat_pump_id: "hp2", pool_range: "Villa", pool_model: "Elysian", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      
      // Entertainer range
      { id: "26", heat_pump_id: "hp2", pool_range: "Entertainer", pool_model: "Bedarra", hp_sku: "IX13", hp_description: "Sunlover Oasis 13kW Heat Pump" },
      { id: "27", heat_pump_id: "hp3", pool_range: "Entertainer", pool_model: "Hayman", hp_sku: "IX19", hp_description: "Sunlover Oasis 19kW Heat Pump" },
      
      // Round Pools range
      { id: "28", heat_pump_id: "hp1", pool_range: "Round Pools", pool_model: "Infinity 3", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "29", heat_pump_id: "hp1", pool_range: "Round Pools", pool_model: "Infinity 4", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" },
      { id: "30", heat_pump_id: "hp1", pool_range: "Round Pools", pool_model: "Terrace 3", hp_sku: "IX9", hp_description: "Sunlover Oasis 9kW Heat Pump" }
    ];

    // Filter by heat pump ID if provided
    let filteredData = localData;
    
    if (heatPumpId) {
      // For demo purposes, filter by SKU since we don't have real IDs yet
      filteredData = localData.filter(item => item.heat_pump_id === heatPumpId);
    } else if (hpSkuFilter) {
      // If no heatPumpId but we have an SKU filter
      filteredData = localData.filter(item => item.hp_sku === hpSkuFilter);
    }

    setCompatibilities(filteredData);
    return filteredData;
  };

  const addCompatibility = async (compatibility: Omit<HeatPumpPoolCompatibility, "id">) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be a database call
      // For now, we'll just add it to the local state with a fake ID
      const newId = `new-${Date.now()}`;
      const newCompatibility = { ...compatibility, id: newId };
      
      setCompatibilities(prev => [...prev, newCompatibility]);
      
      toast({
        title: "Compatibility added",
        description: `Added ${compatibility.pool_model} from ${compatibility.pool_range} range`
      });
      
      return newCompatibility;
    } catch (error: any) {
      console.error("Error adding compatibility:", error);
      toast({
        title: "Error adding compatibility",
        description: error.message,
        variant: "destructive"
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCompatibility = async (id: string) => {
    setIsLoading(true);
    try {
      // In a real implementation, this would be a database call
      // For now, we'll just remove it from the local state
      setCompatibilities(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Compatibility removed"
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting compatibility:", error);
      toast({
        title: "Error removing compatibility",
        description: error.message,
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getCompatibilitiesByHpSku = (sku: string) => {
    return compatibilities.filter(item => item.hp_sku === sku);
  };

  return {
    compatibilities,
    isLoading,
    fetchCompatibilities,
    addCompatibility,
    deleteCompatibility,
    getCompatibilitiesByHpSku
  };
};
