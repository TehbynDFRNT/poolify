import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
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
        // Query the pool_retaining_walls junction table instead of pool_projects
        const { data, error } = await supabase
          .from('pool_retaining_walls')
          .select(`
            id,
            wall_type,
            height1,
            height2,
            length,
            total_cost
          `)
          .eq('pool_project_id', customerId);

        if (error) {
          console.error("Error fetching retaining wall data:", error);
          return { walls: [], totalMargin: 0, totalCost: 0 };
        }

        // Get all wall types from retaining_walls table to use for margin calculation
        const { data: wallTypes, error: wallTypesError } = await supabase
          .from('retaining_walls')
          .select('type, margin');

        if (wallTypesError) {
          console.error("Error fetching retaining wall types:", wallTypesError);
          return { walls: [], totalMargin: 0, totalCost: 0 };
        }

        // Create a map of wall types to their margin rates for easier lookup
        const marginRateMap = new Map();
        wallTypes.forEach((wall) => {
          marginRateMap.set(wall.type, wall.margin);
        });

        if (data && data.length > 0) {
          const wallSummaries: WallSummary[] = [];
          let totalMarginAmount = 0;
          let totalCostAmount = 0;

          // Process each wall from the junction table
          for (let i = 0; i < data.length; i++) {
            const wall = data[i];
            const wallType = wall.wall_type;
            const height1 = wall.height1;
            const height2 = wall.height2;
            const length = wall.length;
            const totalCost = wall.total_cost;

            // Only include walls that have data
            if (wallType && height1 && height2 && length) {
              // Calculate square meters
              const squareMeters = ((Number(height1) + Number(height2)) / 2) * Number(length);

              // Extract wall number from the wall type if it follows the "Wall X:" pattern
              // Otherwise use the array index + 1
              let wallNumber = i + 1;
              let displayType = wallType;

              const wallMatch = wallType.match(/^Wall (\d+): (.*)/);
              if (wallMatch) {
                wallNumber = parseInt(wallMatch[1], 10);
                displayType = wallMatch[2].trim(); // Extract the clean wall type without prefix
              }

              // Get margin rate from our map based on the clean wall type
              const marginRate = marginRateMap.get(displayType) || 0;
              const marginAmount = squareMeters * marginRate;

              wallSummaries.push({
                wallNumber: wallNumber,
                type: displayType,
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

          // Sort the walls by wall number to ensure they display in order
          wallSummaries.sort((a, b) => a.wallNumber - b.wallNumber);

          return {
            walls: wallSummaries,
            totalMargin: parseFloat(totalMarginAmount.toFixed(2)),
            totalCost: parseFloat(totalCostAmount.toFixed(2))
          };
        }

        // Return empty data if there are no walls
        return { walls: [], totalMargin: 0, totalCost: 0 };
      } catch (error) {
        console.error("Error processing retaining wall data:", error);
        return { walls: [], totalMargin: 0, totalCost: 0 };
      }
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
