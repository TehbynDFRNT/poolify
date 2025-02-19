
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
      const { data, error } = await supabase
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
          truckedWater: Number(cost.trucked_water),
          saltBags: Number(cost.salt_bags),
          misc: Number(cost.misc),
          copingSupply: Number(cost.coping_supply),
          beam: Number(cost.beam),
          copingLay: Number(cost.coping_lay),
          peaGravel: Number(cost.pea_gravel),
          installFee: Number(cost.install_fee)
        };
      });

      return { ...initialPoolCosts, ...costsMap };
    },
  });

  const updatePoolCostsMutation = useMutation({
    mutationFn: async ({ poolId, costs }: { poolId: string; costs: PoolCosts }) => {
      const updateData = {
        pool_id: poolId,
        trucked_water: costs.truckedWater,
        salt_bags: costs.saltBags,
        misc: costs.misc,
        coping_supply: costs.copingSupply,
        beam: costs.beam,
        coping_lay: costs.copingLay,
        pea_gravel: costs.peaGravel,
        install_fee: costs.installFee,
      };

      const { error: upsertError } = await supabase
        .from('pool_costs')
        .upsert(updateData, {
          onConflict: 'pool_id'
        });

      if (upsertError) {
        console.error('Error updating pool costs:', upsertError);
        throw upsertError;
      }

      return { poolId };
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
