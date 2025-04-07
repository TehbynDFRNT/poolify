
import { useState, useEffect } from "react";
import { Pool } from "@/types/pool";
import { usePools } from "@/hooks/usePools";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const usePoolSelection = (customerId?: string | null) => {
  const { data: pools, isLoading, error } = usePools();
  const [selectedPoolId, setSelectedPoolId] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Group pools by range for better organization
  const poolsByRange = pools?.reduce((acc, pool) => {
    if (!acc[pool.range]) {
      acc[pool.range] = [];
    }
    acc[pool.range].push(pool);
    return acc;
  }, {} as Record<string, Pool[]>) || {};

  // Fetch existing pool selection if customer ID is available
  useEffect(() => {
    if (customerId) {
      fetchPoolSelection();
    }
  }, [customerId]);

  const fetchPoolSelection = async () => {
    if (!customerId) return;

    try {
      const { data, error } = await supabase
        .from('pool_projects')
        .select('pool_specification_id, pool_color')
        .eq('id', customerId)
        .single();

      if (error) {
        console.error("Error fetching pool selection:", error);
        return;
      }

      if (data) {
        if (data.pool_specification_id) {
          setSelectedPoolId(data.pool_specification_id);
        }
        
        if (data.pool_color) {
          setSelectedColor(data.pool_color);
        }
      }
    } catch (error) {
      console.error("Error in fetchPoolSelection:", error);
    }
  };

  // When a pool is selected, set the default color if available
  useEffect(() => {
    if (selectedPoolId && pools) {
      const pool = pools.find(p => p.id === selectedPoolId);
      if (pool && pool.color) {
        setSelectedColor(pool.color);
      } else {
        setSelectedColor(POOL_COLORS[0]);
      }
    }
  }, [selectedPoolId, pools]);

  // Get the selected pool details
  const selectedPool = pools?.find(p => p.id === selectedPoolId);

  const handleSavePoolSelection = async () => {
    if (!customerId || !selectedPoolId) {
      toast({
        title: "Selection Required",
        description: "Please select a pool model first.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Update the customer record with the selected pool and color
      const { error } = await supabase
        .from('pool_projects')
        .update({
          pool_specification_id: selectedPoolId,
          pool_color: selectedColor
        })
        .eq('id', customerId);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Pool selection saved successfully",
      });
    } catch (error) {
      console.error("Error saving pool selection:", error);
      toast({
        title: "Error",
        description: "Failed to save pool selection. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    pools,
    poolsByRange,
    isLoading,
    error,
    selectedPoolId,
    setSelectedPoolId,
    selectedColor,
    setSelectedColor,
    isSubmitting,
    selectedPool,
    handleSavePoolSelection
  };
};

// Import this at the top of the file
import { POOL_COLORS } from "@/types/pool";
