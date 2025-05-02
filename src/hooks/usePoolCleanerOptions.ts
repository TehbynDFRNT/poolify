
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { PoolCleaner } from "@/types/pool-cleaner";

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

        setAvailableCleaners(cleaners || []);

        // If customerId is provided, fetch existing selection
        if (customerId) {
          const { data: existingSelection, error: selectionError } = await supabase
            .from("pool_cleaner_options")
            .select("*")
            .eq("pool_id", poolId)
            .eq("customer_id", customerId)
            .single();

          if (!selectionError && existingSelection) {
            setIncludeCleaner(existingSelection.include_cleaner);
            
            // Find the selected cleaner
            if (existingSelection.cleaner_id) {
              const selected = cleaners?.find(c => c.id === existingSelection.cleaner_id) || null;
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
        cleaner_id: includeCleaner && selectedCleaner ? selectedCleaner.id : null,
        cleaner_cost: totalCost,
        cleaner_margin: margin,
      };

      // Check if a record already exists
      const { data: existing, error: checkError } = await supabase
        .from("pool_cleaner_options")
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
          .from("pool_cleaner_options")
          .update(payload)
          .eq("id", existing.id);

        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from("pool_cleaner_options")
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
