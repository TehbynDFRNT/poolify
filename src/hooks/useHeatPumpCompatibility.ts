
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { HeatPumpPoolCompatibility } from "@/pages/Quotes/components/SiteRequirementsStep/types";

export const useHeatPumpCompatibility = (heatPumpId?: string) => {
  const [compatibilities, setCompatibilities] = useState<HeatPumpPoolCompatibility[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchCompatibilities = async (hpSkuFilter?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('heat_pump_pool_compatibility')
        .select('*');
      
      if (heatPumpId) {
        query = query.eq('heat_pump_id', heatPumpId);
      } else if (hpSkuFilter) {
        query = query.eq('hp_sku', hpSkuFilter);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setCompatibilities(data || []);
      return data || [];
    } catch (error: any) {
      console.error("Error fetching compatibilities:", error);
      toast({
        title: "Error fetching compatibilities",
        description: error.message,
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addCompatibility = async (compatibility: Omit<HeatPumpPoolCompatibility, "id">) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('heat_pump_pool_compatibility')
        .insert(compatibility)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      setCompatibilities(prev => [...prev, data]);
      
      toast({
        title: "Compatibility added",
        description: `Added ${compatibility.pool_model} from ${compatibility.pool_range} range`
      });
      
      return data;
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
      const { error } = await supabase
        .from('heat_pump_pool_compatibility')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
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
