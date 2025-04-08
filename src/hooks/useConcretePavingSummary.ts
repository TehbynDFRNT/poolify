
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UnderFenceConcreteStripSelection } from "@/types/under-fence-concrete-strip";

export interface SummaryData {
  extraPavingCost: number;
  existingConcretePavingCost: number;
  extraConcretingCost: number;
  concretePumpCost: number;
  underFenceStripsCost: number;
  concreteCutsCost: number;
  extraPavingMargin: number;
  existingConcretePavingMargin: number;
  extraConcretingMargin: number;
  concretePumpMargin: number;
  underFenceStripsMargin: number;
  concreteCutsMargin: number;
  totalCost: number;
  totalMargin: number;
  marginPercentage: number;
}

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

  useEffect(() => {
    if (customerId) {
      fetchSummaryData();
    }
  }, [customerId]);

  const fetchSummaryData = async () => {
    setIsLoading(true);
    try {
      // First, get the basic cost data from pool_projects
      const { data, error } = await supabase
        .from('pool_projects')
        .select(`
          extra_paving_total_cost,
          existing_concrete_paving_total_cost,
          extra_concreting_total_cost,
          concrete_pump_total_cost,
          under_fence_concrete_strips_cost,
          concrete_cuts_cost,
          extra_paving_category,
          extra_paving_square_meters,
          existing_concrete_paving_category,
          existing_concrete_paving_square_meters,
          extra_concreting_type,
          extra_concreting_square_meters,
          under_fence_concrete_strips_data
        `)
        .eq('id', customerId)
        .single();
        
      if (error) {
        console.error("Error fetching concrete and paving summary data:", error);
        return;
      }
      
      if (data) {
        // Extract costs
        const extraPavingCost = data.extra_paving_total_cost || 0;
        const existingConcretePavingCost = data.existing_concrete_paving_total_cost || 0;
        const extraConcretingCost = data.extra_concreting_total_cost || 0;
        const concretePumpCost = data.concrete_pump_total_cost || 0;
        const underFenceStripsCost = data.under_fence_concrete_strips_cost || 0;
        const concreteCutsCost = data.concrete_cuts_cost || 0;

        // Variables to store margin calculations
        let extraPavingMargin = 0;
        let existingConcretePavingMargin = 0;
        let extraConcretingMargin = 0;
        let concretePumpMargin = 0;
        let underFenceStripsMargin = 0;
        let concreteCutsMargin = 0;
        
        // Get margin for extra paving if applicable
        if (data.extra_paving_category && data.extra_paving_square_meters > 0) {
          const { data: pavingData } = await supabase
            .from('extra_paving_costs')
            .select('margin_cost')
            .eq('id', data.extra_paving_category)
            .single();
            
          if (pavingData) {
            extraPavingMargin = pavingData.margin_cost * data.extra_paving_square_meters;
          }
        }
        
        // Get margin for existing concrete paving if applicable
        if (data.existing_concrete_paving_category && data.existing_concrete_paving_square_meters > 0) {
          const { data: existingPavingData } = await supabase
            .from('extra_paving_costs')
            .select('margin_cost')
            .eq('id', data.existing_concrete_paving_category)
            .single();
            
          if (existingPavingData) {
            existingConcretePavingMargin = existingPavingData.margin_cost * data.existing_concrete_paving_square_meters;
          }
        }
        
        // Get margin for extra concreting if applicable
        if (data.extra_concreting_type && data.extra_concreting_square_meters > 0) {
          try {
            const { data: concretingData } = await supabase
              .from('extra_concreting')
              .select('margin')
              .eq('type', data.extra_concreting_type)
              .single();
              
            if (concretingData) {
              extraConcretingMargin = concretingData.margin * data.extra_concreting_square_meters;
            }
          } catch (err) {
            console.error("Error fetching extra concreting margin:", err);
          }
        }
        
        // Get margin for concrete pump
        const { data: pumpData } = await supabase
          .from('concrete_pump')
          .select('*')
          .single();
          
        if (pumpData && concretePumpCost > 0) {
          // Assume a 10% margin on concrete pump if not explicitly stored
          concretePumpMargin = concretePumpCost * 0.1;
        }
        
        // Get margin for under fence strips
        if (data.under_fence_concrete_strips_data) {
          try {
            // Safely type and access the data
            const stripsData = data.under_fence_concrete_strips_data as any[];
            
            if (Array.isArray(stripsData)) {
              for (const strip of stripsData) {
                if (strip && typeof strip === 'object' && 'id' in strip) {
                  // Fetch the margin for this strip type
                  const { data: stripData } = await supabase
                    .from('under_fence_concrete_strips')
                    .select('margin')
                    .eq('id', strip.id)
                    .single();
                    
                  if (stripData && stripData.margin) {
                    // If the strip has a quantity/length property, use it, otherwise assume 1
                    const quantity = typeof strip.length === 'number' ? strip.length : 
                                     typeof strip.quantity === 'number' ? strip.quantity : 1;
                    
                    underFenceStripsMargin += stripData.margin * quantity;
                  }
                }
              }
            }
          } catch (err) {
            console.error("Error calculating under fence strips margin:", err);
          }
        }
        
        // Get margin for concrete cuts (use a default 10% if not explicitly available)
        concreteCutsMargin = concreteCutsCost * 0.1;
        
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
        
        // Calculate margin percentage
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
    } catch (error) {
      console.error("Error fetching concrete and paving summary data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { summaryData, isLoading };
};
