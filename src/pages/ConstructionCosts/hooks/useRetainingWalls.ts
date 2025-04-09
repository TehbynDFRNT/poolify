
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

      // Ensure all required fields are present with default values if needed
      return data.map((wall: any) => ({
        ...wall,
        margin: wall.margin ?? 0,
        total: calculateTotal(wall)
      })) as RetainingWall[];
    },
  });

  // Helper function to calculate total
  const calculateTotal = (wall: any): number => {
    const rate = Number(wall.rate) || 0;
    const extraRate = Number(wall.extra_rate) || 0;
    const margin = Number(wall.margin) || 0;
    return rate + extraRate + margin;
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RetainingWall> }) => {
      // If updates include any of the cost fields but not total, calculate the new total
      if ((updates.rate !== undefined || updates.extra_rate !== undefined || updates.margin !== undefined) && updates.total === undefined) {
        const currentWall = retainingWalls?.find(wall => wall.id === id);
        if (currentWall) {
          const updatedWall = {
            ...currentWall,
            ...updates
          };
          updates.total = calculateTotal(updatedWall);
        }
      }

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
      // Ensure the total is calculated correctly
      const newWall = {
        ...wall,
        total: (wall.rate || 0) + (wall.extra_rate || 0) + (wall.margin || 0)
      };
      
      const { error } = await supabase
        .from("retaining_walls")
        .insert([newWall]);

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
