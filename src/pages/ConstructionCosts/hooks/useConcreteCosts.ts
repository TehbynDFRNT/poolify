
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ConcreteCost, ConcreteCostInsert } from "@/types/concrete-cost";
import type { ConcreteLabourCost } from "@/types/concrete-labour-cost";
import type { ExtraPavingCost } from "@/types/extra-paving-cost";

export const useConcreteCosts = () => {
  const queryClient = useQueryClient();

  const { data: concreteCosts, isLoading: isLoadingConcreteCosts, error: concreteCostsError } = useQuery({
    queryKey: ["concrete-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_costs")
        .select("*")
        .order("display_order", { ascending: true }) as { data: ConcreteCost[] | null, error: any };

      if (error) {
        console.error("Error fetching concrete costs:", error);
        throw error;
      }

      return data as ConcreteCost[];
    },
  });

  const { data: concreteLabourCosts, isLoading: isLoadingLabourCosts, error: labourCostsError } = useQuery({
    queryKey: ["concrete-labour-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_labour_costs")
        .select("*")
        .order("display_order", { ascending: true }) as { data: ConcreteLabourCost[] | null, error: any };

      if (error) {
        console.error("Error fetching concrete labour costs:", error);
        throw error;
      }

      return data as ConcreteLabourCost[];
    },
  });

  const { data: extraPavingCosts, isLoading: isLoadingPavingCosts, error: extraPavingCostsError } = useQuery({
    queryKey: ["extra-paving-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("extra_paving_costs")
        .select("*")
        .order("display_order", { ascending: true }) as { data: ExtraPavingCost[] | null, error: any };

      if (error) {
        console.error("Error fetching extra paving costs:", error);
        throw error;
      }

      return data as ExtraPavingCost[];
    },
  });

  const isLoading = isLoadingConcreteCosts || isLoadingLabourCosts || isLoadingPavingCosts;
  const error = concreteCostsError || labourCostsError || extraPavingCostsError;

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ConcreteCost> }) => {
      const { error } = await supabase
        .from("concrete_costs")
        .update(updates)
        .eq("id", id) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-costs"] });
      toast.success("Concrete cost updated successfully");
    },
    onError: (error) => {
      console.error("Error updating concrete cost:", error);
      toast.error("Failed to update concrete cost");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (cost: ConcreteCostInsert) => {
      const { error } = await supabase
        .from("concrete_costs")
        .insert([cost]) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-costs"] });
      toast.success("Concrete cost added successfully");
    },
    onError: (error) => {
      console.error("Error adding concrete cost:", error);
      toast.error("Failed to add concrete cost");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("concrete_costs")
        .delete()
        .eq("id", id) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-costs"] });
      toast.success("Concrete cost deleted successfully");
    },
    onError: (error) => {
      console.error("Error deleting concrete cost:", error);
      toast.error("Failed to delete concrete cost");
    },
  });

  return {
    concreteCosts,
    concreteLabourCosts,
    extraPavingCosts,
    isLoading,
    error,
    updateMutation,
    addMutation,
    deleteMutation,
  };
};
