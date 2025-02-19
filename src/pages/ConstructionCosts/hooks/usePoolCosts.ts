
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoolCosts } from "../types";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PoolCostsRow = Database['public']['Tables']['pool_costs']['Row'];

export const usePoolCosts = (initialPoolCosts: Record<string, PoolCosts>) => {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedCosts, setEditedCosts] = useState<Record<string, PoolCosts>>(initialPoolCosts);
  const queryClient = useQueryClient();

  const { data: poolCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      console.log('Fetching pool costs');
      const { data, error } = await supabase
        .from('pool_costs')
        .select('*');

      if (error) {
        console.error('Error fetching pool costs:', error);
        throw error;
      }

      // If we have data from the database, use it, otherwise use initial costs
      return data?.length ? data.reduce((acc, cost) => ({
        ...acc,
        [cost.pool_id]: {
          truckedWater: cost.trucked_water,
          saltBags: cost.salt_bags,
          misc: cost.misc,
          copingSupply: cost.coping_supply,
          beam: cost.beam,
          copingLay: cost.coping_lay,
          peaGravel: cost.pea_gravel,
          installFee: cost.install_fee
        }
      }), {...initialPoolCosts}) : initialPoolCosts;
    },
  });

  const updatePoolCostsMutation = useMutation({
    mutationFn: async ({ poolId, costs }: { poolId: string, costs: PoolCosts }) => {
      console.log('Updating pool costs:', { poolId, costs });
      const { data, error } = await supabase
        .from('pool_costs')
        .upsert({
          pool_id: poolId,
          trucked_water: costs.truckedWater,
          salt_bags: costs.saltBags,
          misc: costs.misc,
          coping_supply: costs.copingSupply,
          beam: costs.beam,
          coping_lay: costs.copingLay,
          pea_gravel: costs.peaGravel,
          install_fee: costs.installFee
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating pool costs:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-costs"] });
      toast.success("Changes saved successfully");
      setEditingRow(null);
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      toast.error("Failed to save changes");
    }
  });

  const handleEdit = (poolName: string) => {
    const currentCosts = poolCosts?.[poolName] || initialPoolCosts[poolName];
    setEditingRow(poolName);
    setEditedCosts(prev => ({
      ...prev,
      [poolName]: { ...currentCosts }
    }));
  };

  const handleSave = async (poolId: string, poolName: string) => {
    const updatedCosts = editedCosts[poolName];
    if (!updatedCosts) return;

    updatePoolCostsMutation.mutate({
      poolId,
      costs: updatedCosts
    });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedCosts(initialPoolCosts);
  };

  const handleCostChange = (poolName: string, field: keyof PoolCosts, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setEditedCosts(prev => ({
        ...prev,
        [poolName]: {
          ...prev[poolName],
          [field]: numValue
        }
      }));
    }
  };

  const calculateTotal = (poolId: string) => {
    const costs = editingRow ? editedCosts[poolId] : (poolCosts?.[poolId] || initialPoolCosts[poolId]);
    if (!costs) return 0;
    return Object.values(costs).reduce((sum, value) => sum + (value || 0), 0);
  };

  return {
    editingRow,
    editedCosts,
    costs: poolCosts || initialPoolCosts,
    handleEdit,
    handleSave,
    handleCancel,
    handleCostChange,
    calculateTotal,
  };
};
