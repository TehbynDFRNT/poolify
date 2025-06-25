import type { SummaryData } from "@/types/concrete-paving-summary";
import { fetchConcreteAndPavingData } from "@/utils/concrete-paving-data";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    if (!customerId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchConcreteAndPavingData(customerId);
        
        if (data) {
          const extraPavingCost = data.extra_paving_total_cost || 0;
          const existingConcretePavingCost = data.existing_concrete_paving_total_cost || 0;
          const extraConcretingCost = data.extra_concreting_total_cost || 0;
          const concretePumpCost = (data.concrete_pump_total_cost || 0) + (data.extra_concrete_pump_total_cost || 0);
          const underFenceStripsCost = data.under_fence_concrete_strips_cost || 0;
          const concreteCutsCost = data.concrete_cuts_cost || 0;

          const totalCost =
            extraPavingCost +
            existingConcretePavingCost +
            extraConcretingCost +
            concretePumpCost +
            underFenceStripsCost +
            concreteCutsCost;

          setSummaryData({
            extraPavingCost,
            existingConcretePavingCost,
            extraConcretingCost,
            concretePumpCost,
            underFenceStripsCost,
            concreteCutsCost,
            extraPavingMargin: 0,
            existingConcretePavingMargin: 0,
            extraConcretingMargin: 0,
            concretePumpMargin: 0,
            underFenceStripsMargin: 0,
            concreteCutsMargin: 0,
            totalCost,
            totalMargin: 0,
            marginPercentage: 0
          });
        }
      } catch (err) {
        console.error("Error fetching concrete and paving summary data:", err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [customerId]);

  return {
    summaryData,
    isLoading,
    error
  };
};
