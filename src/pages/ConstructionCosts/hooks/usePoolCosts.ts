
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PoolCosts } from "../types";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type PoolCostsRow = Database['public']['Tables']['pool_costs']['Row'];

export const usePoolCosts = (initialPoolCosts: Record<string, PoolCosts>) => {
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedCosts, setEditedCosts] = useState<Record<string, PoolCosts>>({});
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
          peaGravel: cost.pea_gravel,
          installFee: cost.install_fee,
          truckedWater: cost.trucked_water,
          saltBags: cost.salt_bags,
          misc: cost.misc,
          copingSupply: cost.coping_supply,
          beam: cost.beam,
          copingLay: cost.coping_lay
        };
      });

      return costsMap;
    },
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

    const { error } = await supabase
      .from("pool_costs")
      .upsert({
        pool_id: poolId,
        pea_gravel: updatedCosts.peaGravel,
        install_fee: updatedCosts.installFee,
        trucked_water: updatedCosts.truckedWater,
        salt_bags: updatedCosts.saltBags,
        misc: updatedCosts.misc,
        coping_supply: updatedCosts.copingSupply,
        beam: updatedCosts.beam,
        coping_lay: updatedCosts.copingLay
      });

    if (error) {
      console.error("Error saving pool costs:", error);
      toast.error("Failed to save changes");
      return;
    }

    queryClient.invalidateQueries({ queryKey: ["pool-costs"] });
    setEditingRow(null);
    toast.success("Changes saved successfully");
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedCosts({});
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
    const currentCosts = poolCosts?.[poolId] || initialPoolCosts[poolId];
    if (!currentCosts) return 0;

    return Object.values(currentCosts).reduce((sum, value) => sum + (value || 0), 0);
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
