
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

  const poolCostsQuery = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pool_costs')
        .select('*');

      if (error) {
        toast.error("Failed to fetch pool costs");
        throw error;
      }

      // Transform the data into our expected format
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
    mutationFn: async ({ poolId, costs }: { poolId: string, costs: PoolCosts }) => {
      try {
        // First check if a record exists
        const { data: existingCost } = await supabase
          .from('pool_costs')
          .select('pool_id')
          .eq('pool_id', poolId)
          .single();

        const updateData = {
          trucked_water: costs.truckedWater || 0,
          salt_bags: costs.saltBags || 0,
          misc: costs.misc || 0,
          coping_supply: costs.copingSupply || 0,
          beam: costs.beam || 0,
          coping_lay: costs.copingLay || 0,
          pea_gravel: costs.peaGravel || 0,
          install_fee: costs.installFee || 0,
        };

        if (existingCost) {
          const { error: updateError } = await supabase
            .from('pool_costs')
            .update(updateData)
            .eq('pool_id', poolId);

          if (updateError) throw updateError;
        } else {
          const { error: insertError } = await supabase
            .from('pool_costs')
            .insert({
              pool_id: poolId,
              ...updateData
            });

          if (insertError) throw insertError;
        }

        return costs;
      } catch (error) {
        console.error('Error updating pool costs:', error);
        throw error;
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
    const currentCosts = poolCostsQuery.data?.[poolName] || initialPoolCosts[poolName];
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
    setEditedCosts(poolCostsQuery.data || initialPoolCosts);
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
    const costs = editingRow ? editedCosts[poolName] : (poolCostsQuery.data?.[poolName] || initialPoolCosts[poolName]);
    if (!costs) return 0;
    return Object.values(costs).reduce((sum, value) => sum + (value || 0), 0);
  };

  return {
    editingRow,
    editedCosts,
    costs: poolCostsQuery.data || initialPoolCosts,
    handleEdit,
    handleSave,
    handleCancel,
    handleCostChange,
    calculateTotal,
  };
};
