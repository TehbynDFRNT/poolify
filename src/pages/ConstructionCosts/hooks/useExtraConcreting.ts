
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ExtraConcreting, ExtraConcretingInsert } from "@/types/extra-concreting";

export const useExtraConcreting = () => {
  const queryClient = useQueryClient();

  const { data: extraConcretingItems, isLoading, error } = useQuery({
    queryKey: ["extra-concreting"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extra_concreting")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching extra concreting data:", error);
        throw error;
      }

      // If we don't have any data yet, initialize with our defaults
      if (!data || data.length === 0) {
        const defaultItems = [
          {
            type: "Cover Crete",
            price: 236,
            margin: 89,
            display_order: 1
          },
          {
            type: "Exposed Aggregate",
            price: 125,
            margin: 40,
            display_order: 2
          },
          {
            type: "Standard",
            price: 93,
            margin: 42,
            display_order: 3
          }
        ];

        // Add the default items
        for (const item of defaultItems) {
          await supabase.from("extra_concreting").insert([item]);
        }

        // Fetch the data again
        const { data: refetchedData, error: refetchError } = await supabase
          .from("extra_concreting")
          .select("*")
          .order("display_order", { ascending: true });

        if (refetchError) throw refetchError;
        return refetchedData as ExtraConcreting[];
      }

      return data as ExtraConcreting[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ExtraConcreting> }) => {
      const { error } = await supabase
        .from("extra_concreting")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-concreting"] });
      toast.success("Extra concreting item updated successfully");
    },
    onError: (error) => {
      console.error("Error updating extra concreting item:", error);
      toast.error("Failed to update extra concreting item");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (item: ExtraConcretingInsert) => {
      const { error } = await supabase
        .from("extra_concreting")
        .insert([item]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-concreting"] });
      toast.success("Extra concreting item added successfully");
    },
    onError: (error) => {
      console.error("Error adding extra concreting item:", error);
      toast.error("Failed to add extra concreting item");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("extra_concreting")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["extra-concreting"] });
      toast.success("Extra concreting item deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting extra concreting item:", error);
      toast.error("Failed to delete extra concreting item");
    },
  });

  return {
    extraConcretingItems,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
