
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
    .neq("id", "00000000-0000-0000-0000-000000000000");
  
  if (error) {
    console.error("Error deleting paving costs:", error);
    throw error;
  }
};

// Check if specific default costs already exist
export const checkIfDefaultsExist = async (): Promise<string[]> => {
  const defaultNames = ["Paver", "Wastage", "Margin"];
  
  const { data, error } = await supabase
    .from("paving_costs")
    .select("name")
    .in("name", defaultNames);
  
  if (error) {
    console.error("Error checking if defaults exist:", error);
    throw error;
  }
  
  return data ? data.map(item => item.name) : [];
};

// Helper to create default paving costs
export const createDefaultPavingCosts = async (): Promise<void> => {
  // First check which defaults already exist
  const existingDefaults = await checkIfDefaultsExist();
  
  // Define the defaults we need
  const defaultCosts = [
    { name: "Paver", category1: 99, category2: 114, category3: 137, category4: 137, display_order: 1 },
    { name: "Wastage", category1: 13, category2: 13, category3: 13, category4: 13, display_order: 2 },
    { name: "Margin", category1: 100, category2: 100, category3: 100, category4: 100, display_order: 3 }
  ];

  // Only insert defaults that don't already exist
  for (const cost of defaultCosts) {
    if (!existingDefaults.includes(cost.name)) {
      try {
        await addPavingCost(cost);
      } catch (error) {
        console.error(`Failed to initialize ${cost.name}:`, error);
        throw error;
      }
    }
  }
};
