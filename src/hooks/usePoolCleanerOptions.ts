
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PoolCleaner } from "@/types/pool-cleaner";
import { toast } from "sonner";

interface PoolCleanerSelection {
  id: string;
  customer_id: string;
  pool_id: string;
  pool_cleaner_id: string;
  include_cleaner: boolean;
  created_at: string;
  updated_at: string;
}

export const usePoolCleanerOptions = (
  poolId: string | null,
  customerId: string | null
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [availableCleaners, setAvailableCleaners] = useState<PoolCleaner[]>([]);
  const [selectedCleaner, setSelectedCleaner] = useState<PoolCleaner | null>(null);
  const [includeCleaner, setIncludeCleaner] = useState(false);
  const [existingSelection, setExistingSelection] = useState<PoolCleanerSelection | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch available pool cleaners and existing selection
  useEffect(() => {
    if (poolId && customerId) {
      fetchPoolCleanerOptions();
    } else {
      setIsLoading(false);
    }
  }, [poolId, customerId]);

  // When the selected cleaner changes, update the include cleaner state
  useEffect(() => {
    if (selectedCleaner) {
      setIncludeCleaner(true);
    } else {
      setIncludeCleaner(false);
    }
  }, [selectedCleaner]);

  const fetchPoolCleanerOptions = async () => {
    setIsLoading(true);
    try {
      // Fetch all available pool cleaners
      const { data: cleanersData, error: cleanersError } = await supabase
        .from("pool_cleaners")
        .select("*")
        .order("model_number");

      if (cleanersError) {
        console.error("Error fetching pool cleaners:", cleanersError);
        toast.error("Failed to load pool cleaners");
      } else {
        setAvailableCleaners(cleanersData || []);
      }

      // Fetch existing selection for this customer and pool
      if (customerId && poolId) {
        const { data: selectionData, error: selectionError } = await supabase
          .from("pool_cleaner_selections")
          .select("*, pool_cleaners(*)")
          .eq("customer_id", customerId)
          .eq("pool_id", poolId)
          .maybeSingle();

        if (selectionError && selectionError.code !== "PGRST116") {
          console.error("Error fetching pool cleaner selection:", selectionError);
        } else if (selectionData) {
          setExistingSelection(selectionData);
          setIncludeCleaner(selectionData.include_cleaner);
          
          // If they have a selected cleaner, find it in the available cleaners
          if (selectionData.include_cleaner && selectionData.pool_cleaner_id) {
            const cleaner = cleanersData?.find(c => c.id === selectionData.pool_cleaner_id) || null;
            setSelectedCleaner(cleaner);
          }
        }
      }
    } catch (error) {
      console.error("Error in usePoolCleanerOptions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePoolCleanerSelection = async () => {
    if (!poolId || !customerId) {
      toast.error("Pool and customer information required");
      return;
    }

    if (includeCleaner && !selectedCleaner) {
      toast.error("Please select a pool cleaner");
      return;
    }

    setIsSaving(true);

    try {
      const selectionData = {
        customer_id: customerId,
        pool_id: poolId,
        pool_cleaner_id: selectedCleaner?.id || availableCleaners[0]?.id,
        include_cleaner: includeCleaner,
      };

      let error;
      
      if (existingSelection) {
        // Update existing selection
        const { error: updateError } = await supabase
          .from("pool_cleaner_selections")
          .update(selectionData)
          .eq("id", existingSelection.id);
          
        error = updateError;
      } else {
        // Create new selection
        const { error: insertError } = await supabase
          .from("pool_cleaner_selections")
          .insert(selectionData);
          
        error = insertError;
      }

      if (error) {
        throw error;
      }

      toast.success("Pool cleaner selection saved");
      // Refresh data
      fetchPoolCleanerOptions();
    } catch (error) {
      console.error("Error saving pool cleaner selection:", error);
      toast.error("Failed to save pool cleaner selection");
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate total cost (just the price of the cleaner for now)
  const totalCost = selectedCleaner && includeCleaner ? selectedCleaner.price : 0;
  
  // Calculate margin
  const margin = selectedCleaner && includeCleaner ? selectedCleaner.margin : 0;

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
    margin
  };
};
