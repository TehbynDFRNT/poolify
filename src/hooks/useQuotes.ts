
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";
import { toast } from "sonner";

export const useQuotes = () => {
  return useQuery({
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
};
