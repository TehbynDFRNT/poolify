
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { ConcretePump, ConcretePumpInsert } from "@/types/concrete-pump";

export const useConcretePump = () => {
  const queryClient = useQueryClient();

  const { data: concretePump, isLoading, error } = useQuery({
    queryKey: ["concrete-pump"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("concrete_pump")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1) as { data: ConcretePump[] | null, error: any };

      if (error) {
        console.error("Error fetching concrete pump cost:", error);
        throw error;
      }

      // If no data exists, return a default structure
      if (!data || data.length === 0) {
        return null;
      }

      return data[0] as ConcretePump;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      const { error } = await supabase
        .from("concrete_pump")
        .update({ price })
        .eq("id", id) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-pump"] });
      toast.success("Concrete pump cost updated successfully");
    },
    onError: (error) => {
      console.error("Error updating concrete pump cost:", error);
      toast.error("Failed to update concrete pump cost");
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: ConcretePumpInsert) => {
      const { error } = await supabase
        .from("concrete_pump")
        .insert([data]) as { data: any, error: any };

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["concrete-pump"] });
      toast.success("Concrete pump cost added successfully");
    },
    onError: (error) => {
      console.error("Error adding concrete pump cost:", error);
      toast.error("Failed to add concrete pump cost");
    },
  });

  return {
    concretePump,
    isLoading,
    error,
    updateMutation,
    addMutation,
  };
};
