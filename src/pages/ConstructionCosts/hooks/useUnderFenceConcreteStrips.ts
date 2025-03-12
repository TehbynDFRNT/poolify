
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { UnderFenceConcreteStrip, UnderFenceConcreteStripInsert } from "@/types/under-fence-concrete-strip";

export const useUnderFenceConcreteStrips = () => {
  const queryClient = useQueryClient();

  const { data: underFenceConcreteStrips, isLoading, error } = useQuery({
    queryKey: ["under-fence-concrete-strips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("under_fence_concrete_strips")
        .select("*")
        .order("display_order", { ascending: true }) as { data: UnderFenceConcreteStrip[] | null, error: any };

      if (error) {
        console.error("Error fetching under fence concrete strips:", error);
        throw error;
      }

      return data || [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<UnderFenceConcreteStrip> }) => {
      const { error } = await supabase
        .from("under_fence_concrete_strips")
        .update(updates)
        .eq("id", id) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["under-fence-concrete-strips"] });
      toast.success("Under fence concrete strip updated successfully");
    },
    onError: (error) => {
      console.error("Error updating under fence concrete strip:", error);
      toast.error("Failed to update under fence concrete strip");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: UnderFenceConcreteStripInsert) => {
      const { error } = await supabase
        .from("under_fence_concrete_strips")
        .insert([data]) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["under-fence-concrete-strips"] });
      toast.success("Under fence concrete strip added successfully");
    },
    onError: (error) => {
      console.error("Error adding under fence concrete strip:", error);
      toast.error("Failed to add under fence concrete strip");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("under_fence_concrete_strips")
        .delete()
        .eq("id", id) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["under-fence-concrete-strips"] });
      toast.success("Under fence concrete strip deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting under fence concrete strip:", error);
      toast.error("Failed to delete under fence concrete strip");
    },
  });

  return {
    underFenceConcreteStrips,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
