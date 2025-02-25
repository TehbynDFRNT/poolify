
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { FencingCost, FencingCostInsert } from "../types/fencing";

export const useFencingCosts = () => {
  const queryClient = useQueryClient();

  const { data: fencingCosts } = useQuery({
    queryKey: ["fencingCosts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fencing_costs")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        console.error("Error fetching fencing costs:", error);
        throw error;
      }

      return data as FencingCost[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FencingCost> }) => {
      const { error } = await supabase
        .from("fencing_costs")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fencingCosts"] });
      toast.success("Fencing cost updated successfully");
    },
    onError: (error) => {
      console.error("Error updating fencing cost:", error);
      toast.error("Failed to update fencing cost");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (cost: FencingCostInsert) => {
      const { error } = await supabase
        .from("fencing_costs")
        .insert([cost]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fencingCosts"] });
      toast.success("Fencing cost added successfully");
    },
    onError: (error) => {
      console.error("Error adding fencing cost:", error);
      toast.error("Failed to add fencing cost");
    },
  });

  return {
    fencingCosts,
    updateMutation,
    addMutation,
  };
};
