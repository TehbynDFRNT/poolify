
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoolCosts } from "../types";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PoolCostsRow = Database['public']['Tables']['pool_costs']['Row'];

export const usePoolCosts = (initialPoolCosts: Record<string, PoolCosts>) => {
  const queryClient = useQueryClient();
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedCosts, setEditedCosts] = useState<Record<string, PoolCosts>>(initialPoolCosts);

  const { data: costs = initialPoolCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      let { data, error } = await supabase
        .from('pool_costs')
        .select('*');

      if (error) {
        console.error('Error fetching pool costs:', error);
        toast.error("Failed to fetch pool costs");
        return initialPoolCosts;
      }

      const costsMap: Record<string, PoolCosts> = {};
      (data || []).forEach((cost: PoolCostsRow) => {
        costsMap[cost.pool_id] = {
          truckedWater: Number(cost.trucked_water) || 0,
          saltBags: Number(cost.salt_bags) || 0,
          misc: Number(cost.misc) || 0,
          copingSupply: Number(cost.coping_supply) || 0,
          beam: Number(cost.beam) || 0,
          copingLay: Number(cost.coping_lay) || 0,
          peaGravel: Number(cost.pea_gravel) || 0,
          installFee: Number(cost.install_fee) || 0
        };
      });

      return { ...initialPoolCosts, ...costsMap };
    },
  });

  const updatePoolCostsMutation = useMutation({
    mutationFn: async ({ poolId, costs }: { poolId: string; costs: PoolCosts }) => {
      const updateData = {
        pool_id: poolId,
        trucked_water: costs.truckedWater || 0,
        salt_bags: costs.saltBags || 0,
        misc: costs.misc || 0,
        coping_supply: costs.copingSupply || 0,
        beam: costs.beam || 0,
        coping_lay: costs.copingLay || 0,
        pea_gravel: costs.peaGravel || 0,
        install_fee: costs.installFee || 0,
      };

      const { error } = await supabase
        .from('pool_costs')
        .upsert(updateData, {
          onConflict: 'pool_id'
        });

      if (error) {
        console.error('Error updating pool costs:', error);
        throw new Error('Failed to update pool costs');
      }

      return { success: true };
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
    setEditingRow(poolName);
    setEditedCosts(prev => ({
      ...prev,
      [poolName]: { ...(costs[poolName] || initialPoolCosts[poolName]) }
    }));
  };

  const handleSave = (poolId: string, poolName: string) => {
    const updatedCosts = editedCosts[poolName];
    if (!updatedCosts) return;

    updatePoolCostsMutation.mutate({
      poolId,
      costs: updatedCosts
    });
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedCosts(costs);
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

  const calculateTotal = (poolName: string) => {
    const poolCosts = editingRow ? editedCosts[poolName] : costs[poolName];
    if (!poolCosts) return 0;
    return Object.values(poolCosts).reduce((sum, value) => sum + (value || 0), 0);
  };

  return {
    editingRow,
    editedCosts,
    costs,
    handleEdit,
    handleSave,
    handleCancel,
    handleCostChange,
    calculateTotal,
  };
};
