
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";
import { toast } from "sonner";

export const useQuotes = () => {
  const queryClient = useQueryClient();
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      // First, fetch the quotes
      const { data: quotesData, error: quotesError } = await supabase
        .from("quotes")
        .select("*")
        .order("created_at", { ascending: false });

      if (quotesError) {
        console.error("Error fetching quotes:", quotesError);
        throw quotesError;
      }

      // For quotes with pool_id, fetch the pool details separately
      const quotesWithPools = await Promise.all(
        (quotesData || []).map(async (quote) => {
          if (quote.pool_id) {
            const { data: poolData, error: poolError } = await supabase
              .from("pool_specifications")
              .select("*")
              .eq("id", quote.pool_id)
              .single();

            if (poolError) {
              console.error(`Error fetching pool for quote ${quote.id}:`, poolError);
              return { ...quote, pool: null };
            }

            return { ...quote, pool: poolData };
          }
          return { ...quote, pool: null };
        })
      );

      console.log("Quotes with pools:", quotesWithPools);
      return quotesWithPools as (Quote & { pool: any | null })[];
    },
    meta: {
      onError: (error) => {
        console.error("Error in quotes query:", error);
        toast.error("Failed to load quotes");
      }
    }
  });

  const deleteQuoteMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const { error } = await supabase
        .from("quotes")
        .delete()
        .eq("id", quoteId);
      
      if (error) {
        console.error("Error deleting quote:", error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch quotes after successful deletion
      queryClient.invalidateQueries({ queryKey: ["quotes"] });
      toast.success("Quote deleted successfully");
    },
    onError: (error) => {
      console.error("Error in delete mutation:", error);
      toast.error("Failed to delete quote");
    }
  });

  return {
    data,
    isLoading,
    error,
    refetch,
    deleteQuote: deleteQuoteMutation.mutate,
    isDeletingQuote: deleteQuoteMutation.isPending
  };
};
