
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ConcreteCost, ConcreteCostInsert } from "@/types/concrete-cost";

export const useConcreteCosts = () => {
  const queryClient = useQueryClient();

  const { data: concreteCosts, isLoading, error } = useQuery({
    queryKey: ["concrete-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching concrete costs:", error);
        throw error;
      }

      return data as ConcreteCost[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ConcreteCost> }) => {
      const { error } = await supabase
        .from("concrete_costs")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-costs"] });
      toast.success("Concrete cost updated successfully");
    },
    onError: (error) => {
      console.error("Error updating concrete cost:", error);
      toast.error("Failed to update concrete cost");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (cost: ConcreteCostInsert) => {
      const { error } = await supabase
        .from("concrete_costs")
        .insert([cost]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-costs"] });
      toast.success("Concrete cost added successfully");
    },
    onError: (error) => {
      console.error("Error adding concrete cost:", error);
      toast.error("Failed to add concrete cost");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("concrete_costs")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-costs"] });
      toast.success("Concrete cost deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting concrete cost:", error);
      toast.error("Failed to delete concrete cost");
    },
  });

  return {
    concreteCosts,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
