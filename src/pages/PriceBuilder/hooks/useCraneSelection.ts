
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CraneCost } from '@/types/crane-cost';

// Helper type for crane selections
type CraneSelection = {
  pool_id: string;
  crane_id: string;
};

export const useCraneSelection = (poolId?: string) => {
  const [selectedCraneId, setSelectedCraneId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch all crane costs data
  const { data: craneCosts, isLoading: isLoadingCraneCosts } = useQuery({
    queryKey: ["crane-costs", "default"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("crane_costs")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data as CraneCost[];
    },
  });

  // Fetch the existing crane selection for this pool
  const { data: craneSelection, isLoading: isLoadingSelection } = useQuery({
    queryKey: ["crane-selection", poolId],
    queryFn: async () => {
      if (!poolId) return null;
      
      try {
        // Try to use the RPC function first
        const { data, error } = await supabase
          .rpc('get_crane_selection_for_pool', { pool_id_param: poolId });

        // Fallback if RPC doesn't exist yet
        if (error && error.code === 'PGRST116') {
          // Instead of using the table directly, use generic approach
          const result = await supabase.from('pool_crane_selections')
            .select('crane_id')
            .eq('pool_id', poolId)
            .maybeSingle();
            
          const rawData = result.data;
          const rawError = result.error;
            
          if (rawError && rawError.code !== 'PGRST116') {
            console.error('Error fetching crane selection:', rawError);
            return null;
          }
          
          // Safely return either null or the correctly typed object
          if (rawData && typeof rawData === 'object' && 'crane_id' in rawData) {
            return { pool_id: poolId, crane_id: rawData.crane_id } as CraneSelection;
          }
          return null;
        }
        
        if (error) {
          console.error('Error fetching crane selection:', error);
          return null;
        }
        
        // Safely handle RPC result
        if (data && typeof data === 'object' && 'crane_id' in data && 'pool_id' in data) {
          return data as CraneSelection;
        }
        return null;
      } catch (error) {
        console.error('Error in crane selection query:', error);
        return null;
      }
    },
    enabled: !!poolId,
  });

  // Find the specific Franna crane in the list for the default option
  const frannaCrane = craneCosts?.find(cost => 
    cost.name === "Franna Crane-S20T-L1"
  );

  // Set the selected crane ID from the fetched selection or default to Franna
  useEffect(() => {
    if (craneSelection?.crane_id) {
      setSelectedCraneId(craneSelection.crane_id);
    } else if (frannaCrane?.id && !selectedCraneId) {
      setSelectedCraneId(frannaCrane.id);
    }
  }, [craneSelection, frannaCrane, selectedCraneId]);

  // Get the currently selected crane or default to Franna
  const selectedCrane = selectedCraneId 
    ? craneCosts?.find(cost => cost.id === selectedCraneId) 
    : frannaCrane;

  // Mutation to save crane selection
  const saveCraneMutation = useMutation({
    mutationFn: async () => {
      if (!poolId || !selectedCraneId) return;

      try {
        // Check if there's an existing selection
        const countResult = await supabase.from('pool_crane_selections')
          .select('*', { count: 'exact', head: true })
          .eq('pool_id', poolId);
          
        const count = countResult.count;
        const countError = countResult.error;
          
        if (countError) {
          console.error('Error checking existing crane selection:', countError);
          throw countError;
        }

        if (count && count > 0) {
          // Update existing selection using RPC if available
          const { error } = await supabase
            .rpc('update_crane_selection', { 
              p_pool_id: poolId, 
              p_crane_id: selectedCraneId 
            });

          // Fallback if RPC doesn't exist
          if (error && error.code === 'PGRST116') {
            // Use more generic approach without type assertions
            const result = await supabase.from('pool_crane_selections')
              .update({ crane_id: selectedCraneId })
              .eq('pool_id', poolId);
              
            if (result.error) throw result.error;
          } else if (error) {
            throw error;
          }
        } else {
          // Insert new selection using RPC if available
          const { error } = await supabase
            .rpc('insert_crane_selection', { 
              p_pool_id: poolId, 
              p_crane_id: selectedCraneId 
            });

          // Fallback if RPC doesn't exist
          if (error && error.code === 'PGRST116') {
            // Use more generic approach without type assertions
            const result = await supabase.from('pool_crane_selections')
              .insert({ pool_id: poolId, crane_id: selectedCraneId });
              
            if (result.error) throw result.error;
          } else if (error) {
            throw error;
          }
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

  return {
    craneCosts,
    selectedCraneId,
    setSelectedCraneId,
    selectedCrane,
    frannaCrane,
    isLoading: isLoadingCraneCosts || isLoadingSelection,
    saveCraneSelection: saveCraneMutation.mutate,
    isSaving: saveCraneMutation.isPending
  };
};
