
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ConcreteCut, ConcreteCutInsert } from "@/types/concrete-cut";

export const useConcreteCuts = () => {
  const queryClient = useQueryClient();

  const { data: concreteCuts, isLoading, error } = useQuery({
    queryKey: ["concrete-cuts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_cuts")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching concrete cuts:", error);
        throw error;
      }

      return data as ConcreteCut[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ConcreteCut> }) => {
      const { error } = await supabase
        .from("concrete_cuts")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-cuts"] });
      toast.success("Concrete cut updated successfully");
    },
    onError: (error) => {
      console.error("Error updating concrete cut:", error);
      toast.error("Failed to update concrete cut");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (cut: ConcreteCutInsert) => {
      const { error } = await supabase
        .from("concrete_cuts")
        .insert([cut]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-cuts"] });
      toast.success("Concrete cut added successfully");
    },
    onError: (error) => {
      console.error("Error adding concrete cut:", error);
      toast.error("Failed to add concrete cut");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("concrete_cuts")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-cuts"] });
      toast.success("Concrete cut deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting concrete cut:", error);
      toast.error("Failed to delete concrete cut");
    },
  });

  return {
    concreteCuts,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
