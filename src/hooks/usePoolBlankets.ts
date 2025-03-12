
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PoolBlanket } from "@/types/pool-blanket";

export const usePoolBlankets = () => {
  const queryClient = useQueryClient();

  const { data: poolBlankets, isLoading } = useQuery({
    queryKey: ['pool-blankets'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pool_blankets' as any)
        .select('*')
        .order('pool_range', { ascending: true })
        .order('pool_model', { ascending: true });
      
      if (error) throw error;
      return data as unknown as PoolBlanket[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newBlanket: Omit<PoolBlanket, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('pool_blankets' as any)
        .insert([newBlanket])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as PoolBlanket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-blankets'] });
      toast.success("Pool blanket added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add pool blanket");
      console.error("Error adding pool blanket:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PoolBlanket> }) => {
      const { data, error } = await supabase
        .from('pool_blankets' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as unknown as PoolBlanket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-blankets'] });
      toast.success("Pool blanket updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pool blanket");
      console.error("Error updating pool blanket:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pool_blankets' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-blankets'] });
      toast.success("Pool blanket deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete pool blanket");
      console.error("Error deleting pool blanket:", error);
    },
  });

  return {
    poolBlankets,
    isLoading,
    addPoolBlanket: addMutation.mutate,
    updatePoolBlanket: updateMutation.mutate,
    deletePoolBlanket: deleteMutation.mutate
  };
};
