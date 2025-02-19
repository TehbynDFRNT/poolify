
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoolCosts } from "../types";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PoolCostsRow = Database['public']['Tables']['pool_costs']['Row'];

const DEFAULT_COSTS: PoolCosts = {
  truckedWater: 0,
  saltBags: 0,
  misc: 2700,
  copingSupply: 0,
  beam: 0,
  copingLay: 0,
  peaGravel: 0,
  installFee: 0
};

export const usePoolCosts = (initialPoolCosts: Record<string, PoolCosts>) => {
  const queryClient = useQueryClient();
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedCosts, setEditedCosts] = useState<Record<string, PoolCosts>>(initialPoolCosts);

  const { data: costs = initialPoolCosts, isLoading } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      console.log('Fetching pool costs...');
      const { data, error } = await supabase
        .from('pool_costs')
        .select('*');

      if (error) {
        console.error('Error fetching pool costs:', error);
        throw error;
      }

      console.log('Received pool costs:', data);

      const costsMap: Record<string, PoolCosts> = {};
      (data || []).forEach((cost: PoolCostsRow) => {
        costsMap[cost.pool_id] = {
          truckedWater: Number(cost.trucked_water) || 0,
          saltBags: Number(cost.salt_bags) || 0,
          misc: Number(cost.misc) || 2700,
          copingSupply: Number(cost.coping_supply) || 0,
          beam: Number(cost.beam) || 0,
          copingLay: Number(cost.coping_lay) || 0,
          peaGravel: Number(cost.pea_gravel) || 0,
          installFee: Number(cost.install_fee) || 0
        };
      });

      // Ensure all pools have default costs
      Object.keys(initialPoolCosts).forEach((poolId) => {
        if (!costsMap[poolId]) {
          costsMap[poolId] = { ...DEFAULT_COSTS };
        }
      });

      return costsMap;
    },
    meta: {
      onError: (error: Error) => {
        console.error('Query error:', error);
        toast.error("Failed to fetch pool costs");
      }
    }
  });

  const updatePoolCostsMutation = useMutation({
    mutationFn: async ({ poolId, costs }: { poolId: string; costs: PoolCosts }) => {
      console.log('Updating pool costs:', { poolId, costs });
      
      const { error } = await supabase
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
          install_fee: costs.installFee,
        });

      if (error) {
        console.error('Error in mutation:', error);
        throw error;
      }

      console.log('Successfully updated pool costs');
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
    console.log('Starting edit for pool:', poolName);
    setEditingRow(poolName);
    setEditedCosts(prev => ({
      ...prev,
      [poolName]: { ...(costs[poolName] || initialPoolCosts[poolName]) }
    }));
  };

  const handleSave = (poolId: string, poolName: string) => {
    console.log('Saving costs for pool:', poolName);
    const updatedCosts = editedCosts[poolName];
    if (!updatedCosts) {
      console.warn('No costs found to update');
      return;
    }

    updatePoolCostsMutation.mutate({
      poolId,
      costs: updatedCosts
    });
  };

  const handleCancel = () => {
    console.log('Cancelling edit');
    setEditingRow(null);
    setEditedCosts(costs);
  };

  const handleCostChange = (poolName: string, field: keyof PoolCosts, value: string) => {
    console.log('Changing cost:', { poolName, field, value });
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
    const poolCosts = editingRow ? editedCosts[poolName] : costs[poolName] || DEFAULT_COSTS;
    return Object.values(poolCosts).reduce((sum, value) => sum + (value || 0), 0);
  };

  return {
    editingRow,
    editedCosts,
    costs,
    isLoading,
    handleEdit,
    handleSave,
    handleCancel,
    handleCostChange,
    calculateTotal,
  };
};
