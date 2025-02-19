
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Pool } from "@/types/pool";
import { toast } from "sonner";
import { PoolUpdates } from "../types/poolTableTypes";

export const usePoolUpdates = () => {
  const [editingRows, setEditingRows] = useState<Record<string, Partial<Pool>>>({});
  const queryClient = useQueryClient();

  const updatePoolMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: PoolUpdates }) => {
      console.log('Updating pool with:', { id, updates });
      
      // First, check if the pool exists and get its current data
      const { data: poolsData, error: checkError } = await supabase
        .from("pool_specifications")
        .select()
        .eq("id", id);

      if (checkError) {
        console.error('Error checking pool:', checkError);
        throw checkError;
      }

      if (!poolsData || poolsData.length === 0) {
        throw new Error('Pool not found');
      }

      // Then perform the update
      const { error: updateError } = await supabase
        .from("pool_specifications")
        .update(updates)
        .eq("id", id);

      if (updateError) {
        console.error('Update error:', updateError);
        throw updateError;
      }

      // Finally, fetch the updated data
      const { data: updatedPool, error: fetchError } = await supabase
        .from("pool_specifications")
        .select()
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error('Error fetching updated pool:', fetchError);
        throw fetchError;
      }

      return updatedPool;
    },
    onSuccess: (_, variables) => {
      console.log('Update successful');
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool updated successfully");
      setEditingRows((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (error) => {
      console.error("Error updating pool:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update pool");
    },
  });

  return {
    editingRows,
    setEditingRows,
    updatePoolMutation
  };
};
