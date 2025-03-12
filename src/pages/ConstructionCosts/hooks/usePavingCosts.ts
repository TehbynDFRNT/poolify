
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PavingCost } from "@/types/paving-cost";
import { toast } from "sonner";

export const usePavingCosts = () => {
  const [pavingCosts, setPavingCosts] = useState<PavingCost[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPavingCosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("paving_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        throw error;
      }

      setPavingCosts(data as PavingCost[]);
    } catch (error) {
      console.error("Error fetching paving costs:", error);
      toast.error("Failed to load paving costs");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePavingCost = async (id: string, updates: Partial<PavingCost>) => {
    try {
      const { error } = await supabase
        .from("paving_costs")
        .update(updates)
        .eq("id", id);

      if (error) {
        throw error;
      }

      setPavingCosts((prevCosts) => 
        prevCosts ? prevCosts.map(cost => 
          cost.id === id ? { ...cost, ...updates } : cost
        ) : null
      );
      
      toast.success("Paving cost updated successfully");
    } catch (error) {
      console.error("Error updating paving cost:", error);
      toast.error("Failed to update paving cost");
    }
  };

  useEffect(() => {
    fetchPavingCosts();
  }, []);

  return {
    pavingCosts,
    isLoading,
    refetch: fetchPavingCosts,
    updatePavingCost
  };
};
