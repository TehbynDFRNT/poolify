
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePools } from "@/hooks/usePools";
import { useHeatPumpProducts } from "@/hooks/useHeatPumpProducts";
import { HeatPumpPoolMatch } from "@/types/heat-pump";
import { fetchHeatPumpMatches, createHeatPumpMatch, updateHeatPumpMatch, deleteHeatPumpMatch } from "@/services/heatPumpMatrixService";
import { enrichMatchesWithHeatPumpData, createMissingPoolMatches } from "@/utils/heatPumpMatrixUtils";

export { HeatPumpPoolMatch };

export const useHeatPumpMatrix = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<HeatPumpPoolMatch[]>([]);
  const { toast } = useToast();
  const { heatPumpProducts, fetchHeatPumpProducts, isLoading: isLoadingHeatPumps } = useHeatPumpProducts();
  const { data: pools, isLoading: isLoadingPools } = usePools();

  const fetchMatches = useCallback(async () => {
    setIsLoading(true);
    try {
      // Ensure we have heat pump products loaded
      if (heatPumpProducts.length === 0) {
        await fetchHeatPumpProducts();
      }

      const data = await fetchHeatPumpMatches();
      const enrichedData = enrichMatchesWithHeatPumpData(data, heatPumpProducts);
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
  }, [heatPumpProducts, fetchHeatPumpProducts, toast]);

  const handleUpdateMatch = async (id: string, heatPumpId: string) => {
    try {
      const selectedHeatPump = heatPumpProducts.find(hp => hp.id === heatPumpId);
      
      if (!selectedHeatPump) {
        throw new Error("Selected heat pump not found");
      }
      
      await updateHeatPumpMatch(id, heatPumpId, selectedHeatPump);
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

  const handleDeleteMatch = async (id: string) => {
    try {
      await deleteHeatPumpMatch(id);
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

  const handleCreateMissingPoolMatches = async () => {
    if (!pools || pools.length === 0 || !heatPumpProducts || heatPumpProducts.length === 0) {
      return;
    }

    try {
      setIsLoading(true);
      const createdCount = await createMissingPoolMatches(pools, heatPumpProducts, matches);
      
      if (createdCount === 0) {
        toast({
          title: "No missing matches",
          description: "All pools already have heat pump assignments."
        });
        return;
      }

      await fetchMatches();
      
      toast({
        title: "Missing matches created",
        description: `Created assignments for ${createdCount} pool(s).`
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

  const handleAddMatch = async (
    match: Omit<HeatPumpPoolMatch, "id" | "created_at" | "updated_at" | "hp_sku" | "hp_description" | "cost" | "margin" | "rrp">
  ) => {
    try {
      const selectedHeatPump = heatPumpProducts.find(hp => hp.id === match.heat_pump_id);
      
      if (!selectedHeatPump) {
        throw new Error("Selected heat pump not found");
      }
      
      const data = await createHeatPumpMatch(match, selectedHeatPump);
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

  return {
    matches,
    isLoading: isLoading || isLoadingHeatPumps || isLoadingPools,
    fetchMatches,
    addMatch: handleAddMatch,
    updateMatch: handleUpdateMatch,
    deleteMatch: handleDeleteMatch,
    createMissingPoolMatches: handleCreateMissingPoolMatches,
    heatPumpProducts
  };
};
