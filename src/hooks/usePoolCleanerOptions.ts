
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PoolCleaner, mapDbToPoolCleaner } from "@/types/pool-cleaner";

export const usePoolCleanerOptions = (poolId: string, customerId: string | null) => {
  const [isLoading, setIsLoading] = useState(true);
  const [availableCleaners, setAvailableCleaners] = useState<PoolCleaner[]>([]);
  const [selectedCleaner, setSelectedCleaner] = useState<PoolCleaner | null>(null);
  const [includeCleaner, setIncludeCleaner] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Calculate totals
  const totalCost = includeCleaner && selectedCleaner ? selectedCleaner.rrp : 0;
  const margin = includeCleaner && selectedCleaner ? selectedCleaner.margin : 0;

  useEffect(() => {
    const fetchPoolCleaners = async () => {
      setIsLoading(true);
      try {
        // Fetch all pool cleaners
        const { data: cleaners, error } = await supabase
          .from("pool_cleaners")
          .select("*");

        if (error) {
          throw error;
        }

        // Map the database fields to match our PoolCleaner interface
        const mappedCleaners: PoolCleaner[] = cleaners.map(mapDbToPoolCleaner);
        
        setAvailableCleaners(mappedCleaners);

        // If customerId is provided, fetch existing selection
        if (customerId) {
          const { data: existingSelection, error: selectionError } = await supabase
            .from("pool_cleaner_selections")
            .select("*")
            .eq("pool_id", poolId)
            .eq("customer_id", customerId)
            .maybeSingle();

          if (!selectionError && existingSelection) {
            setIncludeCleaner(existingSelection.include_cleaner);
            
            // Find the selected cleaner
            if (existingSelection.pool_cleaner_id) {
              const selected = mappedCleaners.find(c => c.id === existingSelection.pool_cleaner_id) || null;
              setSelectedCleaner(selected);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching pool cleaner data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPoolCleaners();
  }, [poolId, customerId]);

  const savePoolCleanerSelection = async () => {
    if (!customerId) return;

    setIsSaving(true);
    try {
      const payload = {
        customer_id: customerId,
        pool_id: poolId,
        include_cleaner: includeCleaner,
        pool_cleaner_id: includeCleaner && selectedCleaner ? selectedCleaner.id : null,
      };

      // Check if a record already exists
      const { data: existing, error: checkError } = await supabase
        .from("pool_cleaner_selections")
        .select("id")
        .eq("pool_id", poolId)
        .eq("customer_id", customerId)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      if (existing) {
        // Update existing record
        const { error } = await supabase
          .from("pool_cleaner_selections")
          .update(payload)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("pool_cleaner_selections")
          .insert(payload);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Pool cleaner options saved successfully",
      });
    } catch (error) {
      console.error("Error saving pool cleaner options:", error);
      toast({
        title: "Error",
        description: "Failed to save pool cleaner options",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    availableCleaners,
    selectedCleaner,
    setSelectedCleaner,
    includeCleaner,
    setIncludeCleaner,
    isSaving,
    savePoolCleanerSelection,
    totalCost,
    margin,
  };
};
