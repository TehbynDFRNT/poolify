
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ElectricalCost, ElectricalCostInsert } from "../types/electrical";

export const useElectricalCosts = () => {
  const queryClient = useQueryClient();

  const { data: electricalCosts, isLoading } = useQuery({
    queryKey: ['electrical-costs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('electrical_costs')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data as ElectricalCost[];
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ElectricalCost> }) => {
      const { data, error } = await supabase
        .from('electrical_costs')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electrical-costs'] });
      toast.success('Electrical cost updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update electrical cost');
      console.error('Update error:', error);
    }
  });

  const addMutation = useMutation({
    mutationFn: async (newCost: Partial<ElectricalCost>) => {
      if (!newCost.description || !newCost.rate) {
        throw new Error('Description and rate are required');
      }

      const maxOrder = electricalCosts?.reduce((max, cost) => 
        Math.max(max, cost.display_order), 0) ?? 0;

      const insertData: ElectricalCostInsert = {
        description: newCost.description,
        rate: newCost.rate,
        display_order: maxOrder + 1
      };

      const { data, error } = await supabase
        .from('electrical_costs')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['electrical-costs'] });
      toast.success('New electrical cost added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add electrical cost');
      console.error('Add error:', error);
    }
  });

  return {
    electricalCosts,
    isLoading,
    updateMutation,
    addMutation
  };
};
