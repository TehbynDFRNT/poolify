
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
      const { data: poolCosts, error } = await supabase
        .from('pool_costs')
        .select('*');

      if (error) {
        toast.error("Failed to fetch pool costs");
        throw error;
      }

      // Transform the data into our expected format
      const costsMap: Record<string, PoolCosts> = {};
      poolCosts?.forEach((cost: PoolCostsRow) => {
        costsMap[cost.pool_id] = {
          truckedWater: cost.trucked_water,
          saltBags: cost.salt_bags,
          misc: cost.misc,
          copingSupply: cost.coping_supply,
          beam: cost.beam,
          copingLay: cost.coping_lay,
          peaGravel: cost.pea_gravel,
          installFee: cost.install_fee
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
          .select('*')
          .eq('pool_id', poolId)
          .maybeSingle();

        if (existingCost) {
          // Update existing record
          const { error: updateError } = await supabase
            .from('pool_costs')
            .update({
              trucked_water: costs.truckedWater,
              salt_bags: costs.saltBags,
              misc: costs.misc,
              coping_supply: costs.copingSupply,
              beam: costs.beam,
              coping_lay: costs.copingLay,
              pea_gravel: costs.peaGravel,
              install_fee: costs.installFee,
            })
            .eq('pool_id', poolId);

          if (updateError) throw updateError;
        } else {
          // Insert new record
          const { error: insertError } = await supabase
            .from('pool_costs')
            .insert({
              pool_id: poolId,
              trucked_water: costs.truckedWater,
              salt_bags: costs.saltBags,
              misc: costs.misc,
              coping_supply: costs.copingSupply,
              beam: costs.beam,
              coping_lay: costs.copingLay,
              pea_gravel: costs.peaGravel,
              install_fee: costs.installFee,
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
