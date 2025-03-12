
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ConcreteLab, ConcreteLabInsert } from "@/types/concrete-labour";

export const useConcreteLab = () => {
  const queryClient = useQueryClient();
  
  // Query to fetch concrete labour data
  const { data: concreteLab, isLoading, error } = useQuery({
    queryKey: ["concrete_labour"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_labour" as any)
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as ConcreteLab[];
    },
  });

  // Mutation to add a new concrete labour
  const addMutation = useMutation({
    mutationFn: async (newLab: ConcreteLabInsert) => {
      const { data, error } = await supabase
        .from("concrete_labour" as any)
        .insert(newLab)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete_labour"] });
      toast.success("Concrete labour added successfully");
    },
    onError: (error) => {
      toast.error(`Error adding concrete labour: ${error.message}`);
    },
  });

  // Mutation to update concrete labour
  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ConcreteLab> }) => {
      const { data, error } = await supabase
        .from("concrete_labour" as any)
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete_labour"] });
      toast.success("Concrete labour updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating concrete labour: ${error.message}`);
    },
  });

  // Mutation to delete concrete labour
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("concrete_labour" as any)
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete_labour"] });
      toast.success("Concrete labour deleted successfully");
    },
    onError: (error) => {
      toast.error(`Error deleting concrete labour: ${error.message}`);
    },
  });

  return {
    concreteLab,
    isLoading,
    error,
    addMutation,
    updateMutation,
    deleteMutation,
  };
};
