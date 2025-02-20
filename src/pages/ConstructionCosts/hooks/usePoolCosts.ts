
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PoolCost {
  id: string;
  pool_id: string;
  pea_gravel: number;
  install_fee: number;
  trucked_water: number;
  salt_bags: number;
  misc: number;
  coping_supply: number;
  beam: number;
  coping_lay: number;
}

type PoolCostUpdates = Partial<PoolCost>;

export const usePoolCosts = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCosts, setEditingCosts] = useState<PoolCostUpdates>({});
  const queryClient = useQueryClient();

  const updateCostMutation = useMutation({
    mutationFn: async ({ poolId, updates }: { poolId: string; updates: PoolCostUpdates }) => {
      console.log('Updating pool costs:', { poolId, updates });
      
      // Check if cost record exists
      const { data: existing } = await supabase
        .from('pool_costs')
        .select()
        .eq('pool_id', poolId)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('pool_costs')
          .update(updates)
          .eq('pool_id', poolId)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from('pool_costs')
          .insert([{ pool_id: poolId, ...updates }])
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-costs'] });
      toast.success('Pool costs updated successfully');
      setEditingId(null);
      setEditingCosts({});
    },
    onError: (error) => {
      console.error('Error updating pool costs:', error);
      toast.error('Failed to update pool costs');
    },
  });

  return {
    editingId,
    editingCosts,
    setEditingId,
    setEditingCosts,
    updateCostMutation,
  };
};
