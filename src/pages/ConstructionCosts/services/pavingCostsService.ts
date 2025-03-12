
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { type PavingCost } from "../types/pavingCosts";

// Fetch all paving costs
export const fetchPavingCosts = async (): Promise<PavingCost[]> => {
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
};

// Update a paving cost
export const updatePavingCost = async (
  id: string, 
  updates: Partial<PavingCost>
): Promise<PavingCost> => {
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
};

// Add a new paving cost
export const addPavingCost = async (
  newCost: Omit<PavingCost, "id" | "created_at" | "updated_at">
): Promise<PavingCost> => {
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
};

// Delete all paving costs
export const deleteAllPavingCosts = async (): Promise<void> => {
  const { error } = await supabase
    .from("paving_costs")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000"); // Dummy condition to delete all
  
  if (error) {
    console.error("Error deleting paving costs:", error);
    throw error;
  }
};
