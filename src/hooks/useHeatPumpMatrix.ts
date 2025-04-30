
import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { usePools } from "@/hooks/usePools";
import { useHeatPumpProducts } from "@/hooks/useHeatPumpProducts";
import type { HeatPumpPoolMatch } from "@/types/heat-pump";
import { 
  fetchHeatPumpMatches, 
  createHeatPumpMatch, 
  updateHeatPumpMatch, 
  deleteHeatPumpMatch,
  bulkCreateHeatPumpMatches
} from "@/services/heatPumpMatrixService";
import { 
  enrichMatchesWithHeatPumpData, 
  defaultHeatPumpMatches 
} from "@/utils/heatPumpMatrixUtils";

// Use 'export type' when re-exporting types with isolatedModules enabled
export type { HeatPumpPoolMatch };

export const useHeatPumpMatrix = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [matches, setMatches] = useState<HeatPumpPoolMatch[]>([]);
  const [hasErrored, setHasErrored] = useState(false);
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

      try {
        // Try to fetch from database
        const data = await fetchHeatPumpMatches();
        
        if (data && data.length > 0) {
          // If we got data from database, use it
          const enrichedData = enrichMatchesWithHeatPumpData(data, heatPumpProducts);
          setMatches(enrichedData);
          setHasErrored(false);
        } else {
          // If no data in database, use the default data
          createDefaultMatches();
        }
      } catch (error: any) {
        console.error("Error fetching heat pump matrix:", error);
        setHasErrored(true);
        
        // Use default data with fake IDs since db fetch failed
        const mockData = defaultHeatPumpMatches.map((match, index) => {
          const heatPump = heatPumpProducts.find(hp => hp.hp_sku === match.hp_sku) || heatPumpProducts[0];
          return {
            id: `default-${index}`,
            pool_range: match.pool_range,
            pool_model: match.pool_model,
            heat_pump_id: heatPump?.id || "default",
            hp_sku: match.hp_sku,
            hp_description: match.hp_description,
            cost: heatPump?.cost || 0,
            margin: heatPump?.margin || 0,
            rrp: heatPump?.rrp || 0
          } as HeatPumpPoolMatch;
        });
        
        setMatches(mockData);
        
        toast({
          title: "Error fetching heat pump matrix",
          description: "Using default data instead. Changes won't be saved to database.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error in heat pump matrix setup:", error);
      setHasErrored(true);
      toast({
        title: "Error setting up heat pump matrix",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [heatPumpProducts, fetchHeatPumpProducts, toast]);
  
  // Load data when component mounts
  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const createDefaultMatches = async () => {
    try {
      if (heatPumpProducts.length === 0) {
        throw new Error("No heat pump products available");
      }
      
      await bulkCreateHeatPumpMatches(defaultHeatPumpMatches, heatPumpProducts);
      toast({
        title: "Default heat pump matches created",
        description: "Default heat pump matches have been added to the database."
      });
      await fetchMatches();
    } catch (error: any) {
      console.error("Error creating default matches:", error);
      setHasErrored(true);
      toast({
        title: "Error creating default matches",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleUpdateMatch = async (id: string, heatPumpId: string) => {
    if (hasErrored) {
      toast({
        title: "Cannot update in offline mode",
        description: "Database connection is unavailable. Changes won't be saved.",
        variant: "destructive",
      });
      return false;
    }
    
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
    if (hasErrored) {
      toast({
        title: "Cannot delete in offline mode",
        description: "Database connection is unavailable. Changes won't be saved.",
        variant: "destructive",
      });
      return false;
    }
    
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

  const handleAddMatch = async (
    match: {
      pool_range: string;
      pool_model: string;
      heat_pump_id: string;
    }
  ) => {
    if (hasErrored) {
      toast({
        title: "Cannot add in offline mode",
        description: "Database connection is unavailable. Changes won't be saved.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      const selectedHeatPump = heatPumpProducts.find(hp => hp.id === match.heat_pump_id);
      
      if (!selectedHeatPump) {
        throw new Error("Selected heat pump not found");
      }
      
      const data = await createHeatPumpMatch({
        ...match,
        hp_sku: selectedHeatPump.hp_sku,
        hp_description: selectedHeatPump.hp_description
      });
      
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
    hasErrored,
    fetchMatches,
    addMatch: handleAddMatch,
    updateMatch: handleUpdateMatch,
    deleteMatch: handleDeleteMatch,
    createDefaultMatches,
    heatPumpProducts
  };
};
