
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ConcreteLabourCost, ConcreteLabourCostInsert } from "@/types/concrete-labour-cost";

export const useConcreteLabourCosts = () => {
  const queryClient = useQueryClient();

  const { data: concreteLabourCosts, isLoading, error } = useQuery({
    queryKey: ["concrete-labour-costs"],
    queryFn: async () => {
      // Use a generic approach to work with any table
      const { data, error } = await supabase
        .from("concrete_labour")
        .select("*")
        .order("display_order", { ascending: true }) as { data: ConcreteLabourCost[] | null, error: any };

      if (error) {
        console.error("Error fetching concrete labour costs:", error);
        throw error;
      }

      return data as ConcreteLabourCost[];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ConcreteLabourCost> }) => {
      const { error } = await supabase
        .from("concrete_labour")
        .update(updates)
        .eq("id", id) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-labour-costs"] });
      toast.success("Concrete labour cost updated successfully");
    },
    onError: (error) => {
      console.error("Error updating concrete labour cost:", error);
      toast.error("Failed to update concrete labour cost");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (cost: ConcreteLabourCostInsert) => {
      const { error } = await supabase
        .from("concrete_labour")
        .insert([cost]) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-labour-costs"] });
      toast.success("Concrete labour cost added successfully");
    },
    onError: (error) => {
      console.error("Error adding concrete labour cost:", error);
      toast.error("Failed to add concrete labour cost");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("concrete_labour")
        .delete()
        .eq("id", id) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-labour-costs"] });
      toast.success("Concrete labour cost deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting concrete labour cost:", error);
      toast.error("Failed to delete concrete labour cost");
    },
  });

  return {
    concreteLabourCosts,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
