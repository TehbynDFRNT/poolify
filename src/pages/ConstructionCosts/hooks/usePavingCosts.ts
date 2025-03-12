
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface PavingCost {
  id: string;
  name: string;
  category1: number;
  category2: number;
  category3: number;
  category4: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const usePavingCosts = () => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, number>>({});
  const queryClient = useQueryClient();

  // Fetch paving costs
  const { data: pavingCosts, isLoading } = useQuery({
    queryKey: ["paving-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("paving_costs")
        .select("*")
        .order("display_order");

      if (error) {
        console.error("Error fetching paving costs:", error);
        toast.error("Failed to load paving costs");
        throw error;
      }

      return data as PavingCost[];
    }
  });

  // Update paving cost
  const updatePavingCostMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<PavingCost> }) => {
      const { data, error } = await supabase
        .from("paving_costs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        console.error("Error updating paving cost:", error);
        throw error;
      }

      return data as PavingCost;
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
      const { data, error } = await supabase
        .from("paving_costs")
        .insert(newCost)
        .select()
        .single();

      if (error) {
        console.error("Error adding paving cost:", error);
        throw error;
      }

      return data as PavingCost;
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

  // Initialize the database with default values if empty
  const initializeDefaultValues = async () => {
    if (pavingCosts && pavingCosts.length === 0) {
      const defaultCosts = [
        { name: "Paver", category1: 99, category2: 114, category3: 137, category4: 137, display_order: 1 },
        { name: "Wastage", category1: 13, category2: 13, category3: 13, category4: 13, display_order: 2 },
        { name: "Margin", category1: 100, category2: 100, category3: 100, category4: 100, display_order: 3 }
      ];

      for (const cost of defaultCosts) {
        try {
          await addPavingCostMutation.mutateAsync(cost);
        } catch (error) {
          console.error(`Failed to initialize ${cost.name}:`, error);
        }
      }
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
    initializeDefaultValues
  };
};
