
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export type HeatPumpCompatibility = {
  id: string;
  pool_range: string;
  pool_model: string;
  heat_pump_id?: string;
  hp_sku: string;
  hp_description: string;
  cost?: number;
  rrp?: number;
  margin?: number;
  created_at?: string;
  updated_at?: string;
};

export const useHeatPumpCompatibility = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [compatibility, setCompatibility] = useState<HeatPumpCompatibility[]>([]);
  const { toast } = useToast();

  const fetchCompatibility = async () => {
    setIsLoading(true);
    try {
      // Join with heat_pump_products to get pricing information
      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .select(`
          *,
          heat_pump_products(cost, rrp, margin)
        `)
        .order("pool_range", { ascending: true })
        .order("pool_model", { ascending: true });

      if (error) {
        throw error;
      }

      // Format the data to include pricing info from heat pump products
      const formattedData = (data || []).map(item => ({
        ...item,
        cost: item.heat_pump_products?.cost,
        rrp: item.heat_pump_products?.rrp,
        margin: item.heat_pump_products?.margin,
        // Remove the nested heat_pump_products object
        heat_pump_products: undefined
      })) as HeatPumpCompatibility[];

      setCompatibility(formattedData);
    } catch (error: any) {
      console.error("Error fetching heat pump compatibility data:", error);
      toast({
        title: "Error fetching heat pump compatibility data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addCompatibility = async (record: Omit<HeatPumpCompatibility, "id" | "created_at" | "updated_at">) => {
    setIsLoading(true);
    try {
      // Make sure we're using the Supabase schema requirements - heat_pump_id is nullable in our type
      // but we need to provide a null value explicitly if it's undefined
      const insertData = {
        pool_range: record.pool_range,
        pool_model: record.pool_model,
        heat_pump_id: record.heat_pump_id || null,
        hp_sku: record.hp_sku,
        hp_description: record.hp_description
      };

      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .insert(insertData)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      setCompatibility([...compatibility, data as HeatPumpCompatibility]);
      toast({
        title: "Compatibility record added",
        description: `Heat pump compatibility for ${record.pool_model} has been added successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error adding compatibility record:", error);
      toast({
        title: "Error adding compatibility record",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCompatibility = async (id: string, updates: Partial<HeatPumpCompatibility>) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .update(updates)
        .eq("id", id)
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      setCompatibility(
        compatibility.map((record) => (record.id === id ? data as HeatPumpCompatibility : record))
      );
      
      toast({
        title: "Compatibility record updated",
        description: `Heat pump compatibility for ${(data as HeatPumpCompatibility).pool_model} has been updated successfully.`,
      });
      
      return data;
    } catch (error: any) {
      console.error("Error updating compatibility record:", error);
      toast({
        title: "Error updating compatibility record",
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
      const recordToDelete = compatibility.find(r => r.id === id);
      
      const { error } = await supabase
        .from("heat_pump_pool_compatibility")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setCompatibility(compatibility.filter((record) => record.id !== id));
      
      toast({
        title: "Compatibility record deleted",
        description: recordToDelete ? `Heat pump compatibility for ${recordToDelete.pool_model} has been deleted.` : "Record has been deleted.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error deleting compatibility record:", error);
      toast({
        title: "Error deleting compatibility record",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    compatibility,
    isLoading,
    fetchCompatibility,
    addCompatibility,
    updateCompatibility,
    deleteCompatibility,
  };
};
