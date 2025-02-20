
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoolIndividualCost } from "@/types/pool-individual-cost";
import { toast } from "sonner";

export const usePoolIndividualCosts = () => {
  const [editingRows, setEditingRows] = useState<Record<string, Partial<PoolIndividualCost>>>({});
  const queryClient = useQueryClient();

  const updateCostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PoolIndividualCost> }) => {
      console.log('Starting cost update:', { id, updates });

      const { data, error } = await supabase
        .from("pool_individual_costs")
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      return data as PoolIndividualCost;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pool-individual-costs"] });
      toast.success("Cost updated successfully");
      setEditingRows((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update cost");
    },
  });

  return {
    editingRows,
    setEditingRows,
    updateCostMutation
  };
};
