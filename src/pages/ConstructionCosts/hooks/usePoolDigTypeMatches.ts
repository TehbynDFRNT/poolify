
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PoolDigTypeMatch {
  id: string;
  pool_id: string;
  dig_type_id: string;
  created_at: string;
}

export const usePoolDigTypeMatches = () => {
  const queryClient = useQueryClient();

  const { data: matches, isLoading } = useQuery({
    queryKey: ['pool-dig-type-matches'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pool_dig_type_matches')
        .select('*');

      if (error) throw error;
      return data as PoolDigTypeMatch[];
    }
  });

  const updateMatch = useMutation({
    mutationFn: async ({ poolId, digTypeId }: { poolId: string, digTypeId: string }) => {
      // First try to update, if no rows affected then insert
      const { data: updateData, error: updateError } = await supabase
        .from('pool_dig_type_matches')
        .update({ dig_type_id: digTypeId })
        .eq('pool_id', poolId)
        .select()
        .single();

      if (updateError) {
        if (updateError.code === 'PGRST116') {
          // No rows updated, so insert new record
          const { data: insertData, error: insertError } = await supabase
            .from('pool_dig_type_matches')
            .insert({ pool_id: poolId, dig_type_id: digTypeId })
            .select()
            .single();

          if (insertError) throw insertError;
          return insertData;
        }
        throw updateError;
      }

      return updateData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pool-dig-type-matches'] });
      toast.success("Pool dig type updated successfully");
    },
    onError: (error) => {
      console.error('Error updating pool dig type:', error);
      toast.error("Failed to update pool dig type");
    }
  });

  return {
    matches,
    isLoading,
    updateMatch: updateMatch.mutate,
  };
};
