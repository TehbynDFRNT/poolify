
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
      const { data, error } = await supabase
        .from("pool_specifications")
        .update(updates)
        .eq("id", id)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
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
      toast.error("Failed to update pool");
    },
  });

  return {
    editingRows,
    setEditingRows,
    updatePoolMutation
  };
};
