
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

  useEffect(() => {
    fetchPavingCosts();
  }, []);

  return {
    pavingCosts,
    isLoading,
    refetch: fetchPavingCosts
  };
};
