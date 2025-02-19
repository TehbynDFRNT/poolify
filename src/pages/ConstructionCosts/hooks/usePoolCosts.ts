
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
        toast.error("Failed to fetch pool costs");
        throw error;
      }

      const costsMap: Record<string, PoolCosts> = {};
      (data || []).forEach((cost: PoolCostsRow) => {
        costsMap[cost.pool_id] = {
          truckedWater: cost.trucked_water || 0,
          saltBags: cost.salt_bags || 0,
          misc: cost.misc || 0,
          copingSupply: cost.coping_supply || 0,
          beam: cost.beam || 0,
          copingLay: cost.coping_lay || 0,
          peaGravel: cost.pea_gravel || 0,
          installFee: cost.install_fee || 0
        };
      });

      return { ...initialPoolCosts, ...costsMap };
    },
  });

  const updatePoolCostsMutation = useMutation({
    mutationFn: async ({ poolId, costs }: { poolId: string; costs: PoolCosts }) => {
      const { error: checkError, data: existing } = await supabase
        .from('pool_costs')
        .select('id')
        .eq('pool_id', poolId)
        .maybeSingle();

      if (checkError) throw checkError;

      const updateData = {
        trucked_water: costs.truckedWater,
        salt_bags: costs.saltBags,
        misc: costs.misc,
        coping_supply: costs.copingSupply,
        beam: costs.beam,
        coping_lay: costs.copingLay,
        pea_gravel: costs.peaGravel,
        install_fee: costs.installFee,
      };

      if (existing) {
        const { error } = await supabase
          .from('pool_costs')
          .update(updateData)
          .eq('pool_id', poolId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('pool_costs')
          .insert({ pool_id: poolId, ...updateData });
        if (error) throw error;
      }
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
