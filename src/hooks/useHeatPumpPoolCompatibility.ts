
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type PoolCompatibility = {
  id: string;
  heat_pump_id: string;
  pool_range: string;
  pool_model: string;
  hp_sku: string;
  hp_description: string;
  created_at?: string;
  updated_at?: string;
};

export const useHeatPumpPoolCompatibility = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [compatibilities, setCompatibilities] = useState<PoolCompatibility[]>([]);
  const { toast } = useToast();

  const fetchCompatibilities = async (heatPumpId?: string) => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("heat_pump_pool_compatibility")
        .select("*")
        .order("pool_range", { ascending: true })
        .order("pool_model", { ascending: true });
      
      if (heatPumpId) {
        query = query.eq("heat_pump_id", heatPumpId);
      }
      
      const { data, error } = await query as { data: PoolCompatibility[] | null; error: any };

      if (error) {
        throw error;
      }

      setCompatibilities(data || []);
      return data;
    } catch (error: any) {
      console.error("Error fetching heat pump pool compatibilities:", error);
      toast({
        title: "Error fetching compatibility data",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const addCompatibility = async (compatibility: Omit<PoolCompatibility, "id" | "created_at" | "updated_at">) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .insert(compatibility)
        .select("*")
        .single() as { data: PoolCompatibility | null; error: any };

      if (error) {
        throw error;
      }

      setCompatibilities([...compatibilities, data as PoolCompatibility]);
      toast({
        title: "Compatibility added",
        description: `${compatibility.pool_model} has been linked to ${compatibility.hp_sku}.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error adding heat pump pool compatibility:", error);
      toast({
        title: "Error adding compatibility",
        description: error.message,
        variant: "destructive",
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
        .from("heat_pump_pool_compatibility")
        .delete()
        .eq("id", id) as { error: any };

      if (error) {
        throw error;
      }

      setCompatibilities(compatibilities.filter((item) => item.id !== id));
      toast({
        title: "Compatibility removed",
        description: "Pool model has been unlinked from heat pump.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting heat pump pool compatibility:", error);
      toast({
        title: "Error removing compatibility",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const bulkAddCompatibilities = async (compatibilityItems: Omit<PoolCompatibility, "id" | "created_at" | "updated_at">[]) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .insert(compatibilityItems)
        .select("*") as { data: PoolCompatibility[] | null; error: any };

      if (error) {
        throw error;
      }

      setCompatibilities([...compatibilities, ...(data as PoolCompatibility[])]);
      toast({
        title: "Compatibilities added",
        description: `${compatibilityItems.length} pool models have been linked to heat pumps.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error adding heat pump pool compatibilities:", error);
      toast({
        title: "Error adding compatibilities",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getPoolModelsByHeatPumpId = async (heatPumpId: string) => {
    try {
      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .select("pool_range, pool_model")
        .eq("heat_pump_id", heatPumpId) as { data: { pool_range: string; pool_model: string }[] | null; error: any };

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error: any) {
      console.error("Error fetching pool models by heat pump:", error);
      return [];
    }
  };

  return {
    compatibilities,
    isLoading,
    fetchCompatibilities,
    addCompatibility,
    deleteCompatibility,
    bulkAddCompatibilities,
    getPoolModelsByHeatPumpId
  };
};
