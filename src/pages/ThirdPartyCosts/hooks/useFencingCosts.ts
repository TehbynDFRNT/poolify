
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { FencingCost, FencingCostInsert } from "../types/fencing";

export const useFencingCosts = () => {
  const queryClient = useQueryClient();

  const { data: fencingCosts, isLoading } = useQuery({
    queryKey: ['fencing-costs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fencing_costs')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as FencingCost[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<FencingCost> }) => {
      const { data, error } = await supabase
        .from('fencing_costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fencing-costs'] });
      toast.success('Fencing cost updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update fencing cost');
      console.error('Update error:', error);
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newCost: Partial<FencingCost>) => {
      if (!newCost.description || !newCost.rate) {
        throw new Error('Description and rate are required');
      }

      const maxOrder = fencingCosts?.reduce((max, cost) => 
        Math.max(max, cost.display_order), 0) ?? 0;

      const insertData: FencingCostInsert = {
        description: newCost.description,
        rate: newCost.rate,
        display_order: maxOrder + 1
      };

      const { data, error } = await supabase
        .from('fencing_costs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fencing-costs'] });
      toast.success('New fencing cost added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add fencing cost');
      console.error('Add error:', error);
    }
  });

  return {
    fencingCosts,
    isLoading,
    updateMutation,
    addMutation
  };
};
