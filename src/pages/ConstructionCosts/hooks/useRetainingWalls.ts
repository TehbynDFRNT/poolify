
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { RetainingWall } from "@/types/retaining-wall";

export const useRetainingWalls = () => {
  const queryClient = useQueryClient();

  const { data: retainingWalls } = useQuery({
    queryKey: ["retainingWalls"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("retaining_walls")
        .select("*")
        .order('type', { ascending: true });

      if (error) {
        console.error("Error fetching retaining walls:", error);
        throw error;
      }

      return data as RetainingWall[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RetainingWall> }) => {
      const { error } = await supabase
        .from("retaining_walls")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retainingWalls"] });
      toast.success("Retaining wall updated successfully");
    },
    onError: (error) => {
      console.error("Error updating retaining wall:", error);
      toast.error("Failed to update retaining wall");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (wall: Omit<RetainingWall, 'id'>) => {
      const { error } = await supabase
        .from("retaining_walls")
        .insert([wall]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["retainingWalls"] });
      toast.success("Retaining wall added successfully");
    },
    onError: (error) => {
      console.error("Error adding retaining wall:", error);
      toast.error("Failed to add retaining wall");
    },
  });

  return {
    retainingWalls,
    updateMutation,
    addMutation,
  };
};
