
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { usePools } from "@/hooks/usePools";
import { useHeatPumpProducts } from "@/hooks/useHeatPumpProducts";

export interface HeatPumpPoolMatch {
  id: string;
  pool_range: string;
  pool_model: string;
  heat_pump_id: string;
  hp_sku: string;
  hp_description: string;
  cost: number;
  margin: number;
  rrp: number;
  created_at?: string;
  updated_at?: string;
}

export const useHeatPumpMatrix = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<HeatPumpPoolMatch[]>([]);
  const { toast } = useToast();
  const { heatPumpProducts, isLoading: isLoadingHeatPumps } = useHeatPumpProducts();
  const { data: pools, isLoading: isLoadingPools } = usePools();

  const fetchMatches = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .select("*");

      if (error) {
        throw error;
      }

      // Join with heat pump products data
      const enrichedData = data.map((match) => {
        const heatPump = heatPumpProducts.find(hp => hp.id === match.heat_pump_id);
        return {
          ...match,
          hp_sku: heatPump?.hp_sku || "Not assigned",
          hp_description: heatPump?.hp_description || "Not assigned",
          cost: heatPump?.cost || 0,
          margin: heatPump?.margin || 0,
          rrp: heatPump?.rrp || 0
        };
      });

      setMatches(enrichedData);
    } catch (error: any) {
      console.error("Error fetching heat pump matrix:", error);
      toast({
        title: "Error fetching heat pump matrix",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addMatch = async (match: Omit<HeatPumpPoolMatch, "id" | "created_at" | "updated_at" | "hp_sku" | "hp_description" | "cost" | "margin" | "rrp">) => {
    try {
      const { data, error } = await supabase
        .from("heat_pump_pool_compatibility")
        .insert({
          pool_range: match.pool_range,
          pool_model: match.pool_model,
          heat_pump_id: match.heat_pump_id
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      await fetchMatches();
      toast({
        title: "Match created",
        description: `Heat pump match for ${match.pool_model} has been created.`
      });
      return data;
    } catch (error: any) {
      console.error("Error adding heat pump match:", error);
      toast({
        title: "Error adding match",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  };

  const updateMatch = async (id: string, heatPumpId: string) => {
    try {
      const { error } = await supabase
        .from("heat_pump_pool_compatibility")
        .update({ heat_pump_id: heatPumpId })
        .eq("id", id);

      if (error) {
        throw error;
      }

      await fetchMatches();
      toast({
        title: "Match updated",
        description: "Heat pump assignment has been updated."
      });
      return true;
    } catch (error: any) {
      console.error("Error updating heat pump match:", error);
      toast({
        title: "Error updating match",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteMatch = async (id: string) => {
    try {
      const { error } = await supabase
        .from("heat_pump_pool_compatibility")
        .delete()
        .eq("id", id);

      if (error) {
        throw error;
      }

      setMatches(matches.filter(match => match.id !== id));
      toast({
        title: "Match deleted",
        description: "Heat pump match has been removed."
      });
      return true;
    } catch (error: any) {
      console.error("Error deleting heat pump match:", error);
      toast({
        title: "Error deleting match",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  };

  const createMissingPoolMatches = async () => {
    if (!pools || pools.length === 0 || !heatPumpProducts || heatPumpProducts.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      
      const existingPoolKeys = new Set(matches.map(m => `${m.pool_range}-${m.pool_model}`));
      const missingPools = pools.filter(pool => !existingPoolKeys.has(`${pool.range}-${pool.name}`));
      
      if (missingPools.length === 0) {
        toast({
          title: "No missing matches",
          description: "All pools already have heat pump assignments."
        });
        return;
      }

      // Create default assignments for missing pools
      const defaultHeatPumpId = heatPumpProducts[0]?.id;
      
      for (const pool of missingPools) {
        await supabase
          .from("heat_pump_pool_compatibility")
          .insert({
            pool_range: pool.range || "",
            pool_model: pool.name,
            heat_pump_id: defaultHeatPumpId
          });
      }

      await fetchMatches();
      
      toast({
        title: "Missing matches created",
        description: `Created assignments for ${missingPools.length} pool(s).`
      });
    } catch (error: any) {
      console.error("Error creating missing matches:", error);
      toast({
        title: "Error creating matches",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingHeatPumps) {
      fetchMatches();
    }
  }, [isLoadingHeatPumps]);

  return {
    matches,
    isLoading: isLoading || isLoadingHeatPumps || isLoadingPools,
    fetchMatches,
    addMatch,
    updateMatch,
    deleteMatch,
    createMissingPoolMatches,
    heatPumpProducts
  };
};
