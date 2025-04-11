
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { BlanketRoller } from "@/types/blanket-roller";

export const useBlanketRollers = () => {
  const queryClient = useQueryClient();

  const { data: blanketRollers, isLoading } = useQuery({
    queryKey: ['blanket-rollers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blanket_rollers')
        .select('*')
        .order('pool_range', { ascending: true })
        .order('pool_model', { ascending: true });
      
      if (error) throw error;
      return data as unknown as BlanketRoller[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newBlanketRoller: Omit<BlanketRoller, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('blanket_rollers')
        .insert([newBlanketRoller])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as BlanketRoller;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blanket-rollers'] });
      toast.success("Blanket & roller added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add blanket & roller");
      console.error("Error adding blanket & roller:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<BlanketRoller> }) => {
      const { data, error } = await supabase
        .from('blanket_rollers')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as BlanketRoller;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blanket-rollers'] });
      toast.success("Blanket & roller updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update blanket & roller");
      console.error("Error updating blanket & roller:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blanket_rollers')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blanket-rollers'] });
      toast.success("Blanket & roller deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete blanket & roller");
      console.error("Error deleting blanket & roller:", error);
    },
  });

  return {
    blanketRollers: blanketRollers || [],
    isLoading,
    addBlanketRoller: addMutation.mutate,
    updateBlanketRoller: updateMutation.mutate,
    deleteBlanketRoller: deleteMutation.mutate
  };
};
