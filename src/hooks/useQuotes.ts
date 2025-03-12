
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Quote } from "@/types/quote";
import { toast } from "sonner";

export const useQuotes = () => {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select(`
          *,
          pool:pool_specifications(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching quotes:", error);
        throw error;
      }

      return data as (Quote & { pool: any | null })[];
    },
    meta: {
      onError: (error) => {
        console.error("Error in quotes query:", error);
        toast.error("Failed to load quotes");
      }
    }
  });
};
