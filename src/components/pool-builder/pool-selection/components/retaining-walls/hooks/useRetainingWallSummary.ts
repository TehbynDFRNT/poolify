
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { WallSummary } from "../components/SummaryTable";

interface WallSummaryResult {
  walls: WallSummary[];
  totalMargin: number;
  totalCost: number;
}

export const useRetainingWallSummary = (customerId: string | null, updateCounter: number = 0) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['retainingWallsSummary', customerId],
    queryFn: async (): Promise<WallSummaryResult> => {
      if (!customerId) return { walls: [], totalMargin: 0, totalCost: 0 };
      
      try {
        const { data, error } = await supabase
          .from('pool_projects')
          .select(`
            retaining_wall1_type, retaining_wall1_height1, retaining_wall1_height2, 
            retaining_wall1_length, retaining_wall1_total_cost,
            retaining_wall2_type, retaining_wall2_height1, retaining_wall2_height2, 
            retaining_wall2_length, retaining_wall2_total_cost,
            retaining_wall3_type, retaining_wall3_height1, retaining_wall3_height2, 
            retaining_wall3_length, retaining_wall3_total_cost,
            retaining_wall4_type, retaining_wall4_height1, retaining_wall4_height2, 
            retaining_wall4_length, retaining_wall4_total_cost
          `)
          .eq('id', customerId)
          .single();

        if (error) {
          console.error("Error fetching retaining wall data:", error);
          return { walls: [], totalMargin: 0, totalCost: 0 };
        } 
        
        if (data) {
          const wallSummaries: WallSummary[] = [];
          let totalMarginAmount = 0;
          let totalCostAmount = 0;
          
          // Process each wall (1-4)
          for (let i = 1; i <= 4; i++) {
            const wallType = data[`retaining_wall${i}_type`];
            const height1 = data[`retaining_wall${i}_height1`];
            const height2 = data[`retaining_wall${i}_height2`];
            const length = data[`retaining_wall${i}_length`];
            const totalCost = data[`retaining_wall${i}_total_cost`];
            
            // Only include walls that have data
            if (wallType && height1 && height2 && length) {
              // Calculate square meters
              const squareMeters = ((Number(height1) + Number(height2)) / 2) * Number(length);
              
              // Fetch wall information to get margin rate
              const { data: wallData } = await supabase
                .from('retaining_walls')
                .select('margin')
                .eq('type', wallType)
                .single();
              
              const marginRate = wallData?.margin || 0;
              const marginAmount = squareMeters * marginRate;
              
              wallSummaries.push({
                wallNumber: i,
                type: wallType,
                height1: Number(height1),
                height2: Number(height2),
                length: Number(length),
                squareMeters: parseFloat(squareMeters.toFixed(2)),
                margin: parseFloat(marginAmount.toFixed(2)),
                totalCost: Number(totalCost),
              });
              
              totalMarginAmount += marginAmount;
              totalCostAmount += Number(totalCost);
            }
          }
          
          return { 
            walls: wallSummaries, 
            totalMargin: parseFloat(totalMarginAmount.toFixed(2)), 
            totalCost: parseFloat(totalCostAmount.toFixed(2)) 
          };
        }
      } catch (error) {
        console.error("Error processing retaining wall data:", error);
      }
      
      return { walls: [], totalMargin: 0, totalCost: 0 };
    },
  });

  // Trigger refetch when updateCounter changes
  useEffect(() => {
    refetch();
  }, [updateCounter, refetch]);

  return {
    data: data || { walls: [], totalMargin: 0, totalCost: 0 },
    isLoading
  };
};
