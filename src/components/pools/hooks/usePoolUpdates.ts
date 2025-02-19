
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
      console.log('Starting pool update:', { id, updates });

      const { data, error } = await supabase
        .from("pool_specifications")
        .update(updates)
        .match({ id })
        .select('*');

      console.log('Update response:', { data, error });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      if (!data || data.length === 0) {
        console.error('No data returned after update');
        throw new Error('Failed to update pool - no data returned');
      }

      console.log('Update successful, returning:', data[0]);
      return data[0];
    },
    onSuccess: (data, variables) => {
      console.log('Mutation success handler:', { data, variables });
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Pool updated successfully");
      setEditingRows((prev) => {
        const next = { ...prev };
        delete next[variables.id];
        return next;
      });
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update pool");
    },
  });

  return {
    editingRows,
    setEditingRows,
    updatePoolMutation
  };
};
