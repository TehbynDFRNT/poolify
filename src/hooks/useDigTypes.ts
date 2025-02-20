
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { DigType } from "@/types/dig-type";

export const useDigTypes = () => {
  const queryClient = useQueryClient();

  const { data: digTypes, isLoading } = useQuery({
    queryKey: ['dig-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('dig_types')
        .select('*')
        .order('name') as { data: DigType[] | null; error: any };
      
      if (error) throw error;
      return data ?? [];
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<DigType> }) => {
      const { data, error } = await supabase
        .from('dig_types')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dig-types'] });
      toast.success("Dig type updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update dig type");
      console.error("Error updating dig type:", error);
    },
  });

  return {
    digTypes,
    isLoading,
    updateDigType: updateMutation.mutate,
  };
};
