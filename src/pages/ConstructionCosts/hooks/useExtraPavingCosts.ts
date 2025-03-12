
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ExtraPavingCost, ExtraPavingCostInsert } from "@/types/extra-paving-cost";

export const useExtraPavingCosts = () => {
  const queryClient = useQueryClient();

  const { data: extraPavingCosts, isLoading, error } = useQuery({
    queryKey: ["extra-paving-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extra_paving_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching extra paving costs:", error);
        throw error;
      }

      return data as ExtraPavingCost[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ExtraPavingCost> }) => {
      const { error } = await supabase
        .from("extra_paving_costs")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-paving-costs"] });
      toast.success("Extra paving cost updated successfully");
    },
    onError: (error) => {
      console.error("Error updating extra paving cost:", error);
      toast.error("Failed to update extra paving cost");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (cost: ExtraPavingCostInsert) => {
      const { error } = await supabase
        .from("extra_paving_costs")
        .insert([cost]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-paving-costs"] });
      toast.success("Extra paving cost added successfully");
    },
    onError: (error) => {
      console.error("Error adding extra paving cost:", error);
      toast.error("Failed to add extra paving cost");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("extra_paving_costs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-paving-costs"] });
      toast.success("Extra paving cost deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting extra paving cost:", error);
      toast.error("Failed to delete extra paving cost");
    },
  });

  return {
    extraPavingCosts,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
