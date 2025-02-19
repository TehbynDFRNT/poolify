
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
      return initialPoolCosts;
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
    setEditingRow(null);
    toast.success("Changes saved successfully");
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
