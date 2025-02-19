
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

  // Fetch pool costs from database
  const { data: poolCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*");

      if (error) {
        console.error("Error fetching pool costs:", error);
        throw error;
      }

      const costsMap: Record<string, PoolCosts> = {};
      data?.forEach(cost => {
        costsMap[cost.pool_id] = {
          peaGravel: cost.pea_gravel || 0,
          installFee: cost.install_fee || 0,
          truckedWater: cost.trucked_water || 0,
          saltBags: cost.salt_bags || 0,
          misc: cost.misc || 2700,
          copingSupply: cost.coping_supply || 0,
          beam: cost.beam || 0,
          copingLay: cost.coping_lay || 0
        };
      });

      // Merge with initial costs for any pools that don't have data yet
      Object.entries(initialPoolCosts).forEach(([poolId, costs]) => {
        if (!costsMap[poolId]) {
          costsMap[poolId] = costs;
        }
      });

      return costsMap;
    },
  });

  // Update pool costs mutation
  const updatePoolCostsMutation = useMutation({
    mutationFn: async (variables: { poolId: string; costs: PoolCosts }) => {
      console.log("Updating pool costs:", variables);

      const { data, error } = await supabase
        .from("pool_costs")
        .upsert({
          pool_id: variables.poolId,
          pea_gravel: variables.costs.peaGravel,
          install_fee: variables.costs.installFee,
          trucked_water: variables.costs.truckedWater,
          salt_bags: variables.costs.saltBags,
          misc: variables.costs.misc,
          coping_supply: variables.costs.copingSupply,
          beam: variables.costs.beam,
          coping_lay: variables.costs.copingLay
        })
        .select();

      if (error) {
        console.error("Error updating pool costs:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pool-costs"] });
      toast.success("Pool costs updated successfully");
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error("Failed to update pool costs");
    },
  });

  const handleEdit = (poolName: string) => {
    setEditingRow(poolName);
    setEditedCosts(prev => ({
      ...prev,
      [poolName]: { ...(poolCosts?.[poolName] || initialPoolCosts[poolName]) }
    }));
  };

  const handleSave = async (poolId: string, poolName: string) => {
    try {
      await updatePoolCostsMutation.mutateAsync({
        poolId,
        costs: editedCosts[poolName]
      });
      setEditingRow(null);
    } catch (error) {
      console.error("Error saving pool costs:", error);
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedCosts(poolCosts || initialPoolCosts);
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
    const currentCosts = poolCosts?.[poolId] || initialPoolCosts[poolId] || {
      truckedWater: 0,
      saltBags: 0,
      misc: 2700,
      copingSupply: 0,
      beam: 0,
      copingLay: 0,
      peaGravel: 0,
      installFee: 0
    };

    return Object.values(currentCosts).reduce((sum, value) => sum + value, 0);
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
