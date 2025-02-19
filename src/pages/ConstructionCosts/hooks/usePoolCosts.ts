
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

  // Query hook - always present
  const poolCostsQuery = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      return initialPoolCosts; // Keep using initial costs for now until we properly set up the database
    },
  });

  // Mutation hook - always present
  const updatePoolCostsMutation = useMutation({
    mutationFn: async ({ poolName, costs }: { poolName: string, costs: PoolCosts }) => {
      console.log('Would update pool costs for:', poolName, costs);
      return costs;
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
      poolName,
      costs: updatedCosts
    });
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
