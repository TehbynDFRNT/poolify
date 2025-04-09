
import { useState, useCallback, useEffect } from "react";
import { fetchConcreteAndPavingData } from "@/utils/concrete-paving-data";
import { 
  calculateExtraPavingMargin,
  calculateExtraConcretingMargin,
  calculateUnderFenceStripsMargin,
  calculateConcretePumpMargin,
  calculateConcreteCutsMargin
} from "@/utils/concrete-margin-calculations";
import type { SummaryData } from "@/types/concrete-paving-summary";

// Use 'export type' to re-export the type when isolatedModules is enabled
export type { SummaryData } from "@/types/concrete-paving-summary";

export const useConcretePavingSummary = (customerId: string) => {
  const [summaryData, setSummaryData] = useState<SummaryData>({
    extraPavingCost: 0,
    existingConcretePavingCost: 0,
    extraConcretingCost: 0,
    concretePumpCost: 0,
    underFenceStripsCost: 0,
    concreteCutsCost: 0,
    extraPavingMargin: 0,
    existingConcretePavingMargin: 0,
    extraConcretingMargin: 0,
    concretePumpMargin: 0,
    underFenceStripsMargin: 0,
    concreteCutsMargin: 0,
    totalCost: 0,
    totalMargin: 0,
    marginPercentage: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSummaryData = useCallback(async () => {
    if (!customerId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // First, get the basic cost data from pool_projects
      const data = await fetchConcreteAndPavingData(customerId);
      
      if (data) {
        // Extract costs
        const extraPavingCost = data.extra_paving_total_cost || 0;
        const existingConcretePavingCost = data.existing_concrete_paving_total_cost || 0;
        const extraConcretingCost = data.extra_concreting_total_cost || 0;
        const concretePumpCost = data.concrete_pump_total_cost || 0;
        const underFenceStripsCost = data.under_fence_concrete_strips_cost || 0;
        const concreteCutsCost = data.concrete_cuts_cost || 0;

        // Calculate margins using our utility functions
        const extraPavingMargin = await calculateExtraPavingMargin(
          data.extra_paving_category, 
          data.extra_paving_square_meters || 0
        );
        
        const existingConcretePavingMargin = await calculateExtraPavingMargin(
          data.existing_concrete_paving_category, 
          data.existing_concrete_paving_square_meters || 0
        );
        
        const extraConcretingMargin = await calculateExtraConcretingMargin(
          data.extra_concreting_type,
          data.extra_concreting_square_meters || 0
        );
        
        const concretePumpMargin = calculateConcretePumpMargin(concretePumpCost);
        
        const underFenceStripsMargin = await calculateUnderFenceStripsMargin(
          data.under_fence_concrete_strips_data
        );
        
        const concreteCutsMargin = calculateConcreteCutsMargin(concreteCutsCost);
        
        // Calculate totals
        const totalCost = 
          extraPavingCost +
          existingConcretePavingCost +
          extraConcretingCost +
          concretePumpCost +
          underFenceStripsCost +
          concreteCutsCost;
          
        const totalMargin = 
          extraPavingMargin +
          existingConcretePavingMargin +
          extraConcretingMargin +
          concretePumpMargin +
          underFenceStripsMargin +
          concreteCutsMargin;
        
        // Calculate margin percentage for internal use only
        const marginPercentage = totalCost > 0 ? (totalMargin / totalCost) * 100 : 0;
        
        setSummaryData({
          extraPavingCost,
          existingConcretePavingCost,
          extraConcretingCost,
          concretePumpCost,
          underFenceStripsCost,
          concreteCutsCost,
          extraPavingMargin,
          existingConcretePavingMargin,
          extraConcretingMargin,
          concretePumpMargin,
          underFenceStripsMargin,
          concreteCutsMargin,
          totalCost,
          totalMargin,
          marginPercentage
        });
      }
    } catch (err) {
      console.error("Error fetching concrete and paving summary data:", err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    } finally {
      setIsLoading(false);
    }
  }, [customerId]);

  // Execute the fetch on initial load
  useEffect(() => {
    if (customerId) {
      fetchSummaryData();
    }
  }, [customerId, fetchSummaryData]);

  return { 
    summaryData, 
    isLoading,
    error,
    refreshSummary: fetchSummaryData 
  };
};
