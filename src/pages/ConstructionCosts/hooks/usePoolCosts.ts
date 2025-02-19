
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
      // Destructure the response immediately to avoid passing non-cloneable objects
      const { data, error } = await supabase
        .from('pool_costs')
        .select('*');

      if (error) {
        console.error('Error fetching pool costs:', error);
        toast.error("Failed to fetch pool costs");
        return initialPoolCosts;
      }

      // Create a plain object with only the data we need
      const costsMap: Record<string, PoolCosts> = {};
      (data || []).forEach((cost: PoolCostsRow) => {
        // Ensure we're only working with plain numbers
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
      // Destructure immediately to work with plain data
      const { data: existing } = await supabase
        .from('pool_costs')
        .select('id')
        .eq('pool_id', poolId)
        .single();

      // Create a plain object for the update
      const updateData = {
        trucked_water: Number(costs.truckedWater) || 0,
        salt_bags: Number(costs.saltBags) || 0,
        misc: Number(costs.misc) || 0,
        coping_supply: Number(costs.copingSupply) || 0,
        beam: Number(costs.beam) || 0,
        coping_lay: Number(costs.copingLay) || 0,
        pea_gravel: Number(costs.peaGravel) || 0,
        install_fee: Number(costs.installFee) || 0,
      };

      // Handle update or insert
      const { error } = existing 
        ? await supabase
            .from('pool_costs')
            .update(updateData)
            .eq('pool_id', poolId)
        : await supabase
            .from('pool_costs')
            .insert({ pool_id: poolId, ...updateData });

      if (error) throw error;

      // Return a plain object
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
