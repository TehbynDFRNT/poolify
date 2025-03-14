
import { useState, useEffect } from 'react';
import { useCraneCosts } from './useCraneCosts';
import { useFetchCraneSelection } from './useCraneSelection';
import { useSaveCraneSelection } from './useSaveCraneSelection';
import { UseCraneSelectionResult } from './types';

export const useCraneSelection = (poolId?: string): UseCraneSelectionResult => {
  const [selectedCraneId, setSelectedCraneId] = useState<string | null>(null);
  
  // Fetch all crane costs data
  const { data: craneCosts, isLoading: isLoadingCraneCosts } = useCraneCosts();

  // Fetch the existing crane selection for this pool
  const { data: craneSelection, isLoading: isLoadingSelection } = useFetchCraneSelection(poolId);

  // Set up the save mutation
  const saveCraneMutation = useSaveCraneSelection();

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

  const saveCraneSelection = () => {
    if (poolId && selectedCraneId) {
      saveCraneMutation.mutate({ poolId, selectedCraneId });
    }
  };

  return {
    craneCosts,
    selectedCraneId,
    setSelectedCraneId,
    selectedCrane,
    frannaCrane,
    isLoading: isLoadingCraneCosts || isLoadingSelection,
    saveCraneSelection,
    isSaving: saveCraneMutation.isPending
  };
};

// Re-export the types
export * from './types';
