
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { WaterFeature, WaterFeatureInsert } from "@/types/water-feature";

export const useWaterFeatures = () => {
  const queryClient = useQueryClient();

  const { data: waterFeatures, isLoading, error } = useQuery({
    queryKey: ["water-features"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("water_features")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching water features:", error);
        throw error;
      }

      return data as WaterFeature[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<WaterFeature> }) => {
      const { error } = await supabase
        .from("water_features")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-features"] });
      toast.success("Water feature updated successfully");
    },
    onError: (error) => {
      console.error("Error updating water feature:", error);
      toast.error("Failed to update water feature");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (feature: WaterFeatureInsert) => {
      const { error } = await supabase
        .from("water_features")
        .insert([feature]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-features"] });
      toast.success("Water feature added successfully");
    },
    onError: (error) => {
      console.error("Error adding water feature:", error);
      toast.error("Failed to add water feature");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("water_features")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["water-features"] });
      toast.success("Water feature deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting water feature:", error);
      toast.error("Failed to delete water feature");
    },
  });

  return {
    waterFeatures,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
