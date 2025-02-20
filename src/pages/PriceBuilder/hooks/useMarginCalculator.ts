
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PoolMargin {
  id: string;
  pool_id: string;
  margin_percentage: number;
  created_at: string;
  updated_at: string;
}

export const useMarginCalculator = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempMargin, setTempMargin] = useState<string>("");
  const queryClient = useQueryClient();

  // Fetch existing margins
  const { data: margins = {} } = useQuery({
    queryKey: ["pool-margins"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_margins")
        .select("*") as { data: PoolMargin[] | null; error: any };

      if (error) {
        console.error("Error fetching margins:", error);
        throw error;
      }

      // Convert array of margins to a Record object
      return (data || []).reduce((acc, curr) => ({
        ...acc,
        [curr.pool_id]: curr.margin_percentage
      }), {} as Record<string, number>);
    }
  });

  // Mutation for updating margins
  const updateMarginMutation = useMutation({
    mutationFn: async ({ poolId, margin }: { poolId: string, margin: number }) => {
      const { data, error } = await supabase
        .from("pool_margins")
        .upsert(
          { pool_id: poolId, margin_percentage: margin },
          { onConflict: "pool_id" }
        )
        .select()
        .single() as { data: PoolMargin | null; error: any };

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-margins"] });
      toast.success("Margin updated successfully");
    },
    onError: (error) => {
      console.error("Error updating margin:", error);
      toast.error("Failed to update margin");
    }
  });

  const handleStartEdit = (poolId: string) => {
    setEditingId(poolId);
    setTempMargin(margins[poolId]?.toString() || "");
  };

  const handleSave = async (poolId: string) => {
    const numValue = parseFloat(tempMargin) || 0;
    const clampedValue = Math.min(numValue, 99.9);
    
    try {
      await updateMarginMutation.mutateAsync({
        poolId,
        margin: clampedValue
      });
      setEditingId(null);
    } catch (error) {
      // Error is handled by the mutation callbacks
      console.error("Error in handleSave:", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTempMargin("");
  };

  return {
    margins,
    editingId,
    tempMargin,
    setTempMargin,
    handleStartEdit,
    handleSave,
    handleCancel
  };
};
