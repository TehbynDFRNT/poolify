
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { type PavingCost } from "../types/pavingCosts";
import {
  fetchPavingCosts,
  updatePavingCost,
  addPavingCost,
  deleteAllPavingCosts
} from "../services/pavingCostsService";

export type { PavingCost } from "../types/pavingCosts";

export const usePavingCosts = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  // Fetch paving costs
  const { data: pavingCosts, isLoading } = useQuery({
    queryKey: ["paving-costs"],
    queryFn: fetchPavingCosts
  });

  // Update paving cost
  const updatePavingCostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PavingCost> }) => {
      return updatePavingCost(id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paving-costs"] });
      toast.success("Paving cost updated successfully");
      setEditingId(null);
      setEditingValues({});
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error("Failed to update paving cost");
    }
  });

  // Add new paving cost
  const addPavingCostMutation = useMutation({
    mutationFn: async (newCost: Omit<PavingCost, "id" | "created_at" | "updated_at">) => {
      return addPavingCost(newCost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paving-costs"] });
      toast.success("Paving cost added successfully");
    },
    onError: (error) => {
      console.error("Error in mutation:", error);
      toast.error("Failed to add paving cost");
    }
  });

  // Start editing a cost
  const handleEdit = (id: string, cost: PavingCost) => {
    setEditingId(id);
    setEditingValues({
      category1: cost.category1,
      category2: cost.category2,
      category3: cost.category3,
      category4: cost.category4
    });
  };

  // Handle saving edits
  const handleSave = (id: string) => {
    if (Object.keys(editingValues).length > 0) {
      updatePavingCostMutation.mutate({
        id,
        updates: editingValues
      });
    } else {
      setEditingId(null);
    }
  };

  // Handle canceling edits
  const handleCancel = () => {
    setEditingId(null);
    setEditingValues({});
  };

  // Handle change in a value
  const handleValueChange = (category: string, value: number) => {
    setEditingValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  // Delete all paving costs data from the table
  const deleteAllPavingCostsHandler = async () => {
    try {
      console.log("Deleting all paving costs");
      
      await deleteAllPavingCosts();
      
      // Refresh the data
      queryClient.invalidateQueries({ queryKey: ["paving-costs"] });
      toast.success("All paving costs deleted successfully");
    } catch (error) {
      console.error("Error deleting paving costs:", error);
      toast.error("Failed to delete paving costs");
    }
  };

  return {
    pavingCosts,
    isLoading,
    editingId,
    editingValues,
    handleEdit,
    handleSave,
    handleCancel,
    handleValueChange,
    updatePavingCostMutation,
    addPavingCostMutation,
    deleteAllPavingCosts: deleteAllPavingCostsHandler
  };
};
