
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { PoolCleaner } from "@/types/pool-cleaner";

export const usePoolCleaners = () => {
  const queryClient = useQueryClient();

  const { data: poolCleaners, isLoading } = useQuery({
    queryKey: ['pool-cleaners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pool_cleaners' as any)
        .select('*')
        .order('model_number');
      
      if (error) throw error;
      return data as PoolCleaner[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (newCleaner: Omit<PoolCleaner, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('pool_cleaners' as any)
        .insert([newCleaner])
        .select()
        .single();

      if (error) throw error;
      return data as PoolCleaner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-cleaners'] });
      toast.success("Pool cleaner added successfully");
    },
    onError: (error) => {
      toast.error("Failed to add pool cleaner");
      console.error("Error adding pool cleaner:", error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PoolCleaner> }) => {
      const { data, error } = await supabase
        .from('pool_cleaners' as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data as PoolCleaner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-cleaners'] });
      toast.success("Pool cleaner updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update pool cleaner");
      console.error("Error updating pool cleaner:", error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('pool_cleaners' as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-cleaners'] });
      toast.success("Pool cleaner deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete pool cleaner");
      console.error("Error deleting pool cleaner:", error);
    },
  });

  return {
    poolCleaners,
    isLoading,
    addPoolCleaner: addMutation.mutate,
    updatePoolCleaner: updateMutation.mutate,
    deletePoolCleaner: deleteMutation.mutate
  };
};
