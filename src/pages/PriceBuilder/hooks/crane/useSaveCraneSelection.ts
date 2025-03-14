
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SaveCraneSelectionParams {
  poolId?: string;
  selectedCraneId: string | null;
}

export const useSaveCraneSelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ poolId, selectedCraneId }: SaveCraneSelectionParams) => {
      if (!poolId || !selectedCraneId) return;

      try {
        // Check if there's an existing selection
        const { count, error: countError } = await supabase
          .from('pool_crane_selections')
          .select('*', { count: 'exact', head: true })
          .eq('pool_id', poolId);
          
        if (countError) {
          console.error('Error checking existing crane selection:', countError);
          throw countError;
        }

        if (count && count > 0) {
          // Update existing selection
          const { error } = await supabase
            .from('pool_crane_selections')
            .update({ crane_id: selectedCraneId })
            .eq('pool_id', poolId);
              
          if (error) throw error;
        } else {
          // Insert new selection
          const { error } = await supabase
            .from('pool_crane_selections')
            .insert({ pool_id: poolId, crane_id: selectedCraneId });
              
          if (error) throw error;
        }

        // Invalidate the queries to refresh the data
        queryClient.invalidateQueries({ queryKey: ["crane-selection", poolId] });
        queryClient.invalidateQueries({ queryKey: ["selected-crane", poolId] });
        return true;
      } catch (error) {
        console.error('Error saving crane selection:', error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success("Crane selection updated");
    },
    onError: (error) => {
      console.error("Error saving crane selection:", error);
      toast.error("Failed to update crane selection");
    }
  });
};
