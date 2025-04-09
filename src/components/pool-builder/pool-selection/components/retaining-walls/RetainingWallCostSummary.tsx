
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface WallSummary {
  wallNumber: number;
  type: string;
  height1: number;
  height2: number;
  length: number;
  squareMeters: number;
  margin: number;
  totalCost: number;
}

interface RetainingWallCostSummaryProps {
  customerId: string | null;
  updateCounter?: number; // Used to trigger refetches
}

export const RetainingWallCostSummary: React.FC<RetainingWallCostSummaryProps> = ({ 
  customerId,
  updateCounter = 0
}) => {
  // Use React Query for data fetching and automatic refetching
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['retainingWallsSummary', customerId],
    queryFn: async () => {
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
  
  // Don't render anything if no walls have data
  if ((!data || data.walls.length === 0) && !isLoading) {
    return null;
  }

  const walls = data?.walls || [];
  const totalMargin = data?.totalMargin || 0;
  const totalCost = data?.totalCost || 0;

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl font-semibold">Retaining Walls Cost Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-4 text-center text-muted-foreground">Loading retaining wall data...</div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Wall</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Dimensions</TableHead>
                  <TableHead className="text-right">Area</TableHead>
                  <TableHead className="text-right">Margin</TableHead>
                  <TableHead className="text-right">Total Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walls.map((wall) => (
                  <TableRow key={`wall-${wall.wallNumber}`}>
                    <TableCell className="font-medium">Wall {wall.wallNumber}</TableCell>
                    <TableCell>{wall.type}</TableCell>
                    <TableCell className="text-right">
                      {wall.height1}m × {wall.height2}m × {wall.length}m
                    </TableCell>
                    <TableCell className="text-right">{wall.squareMeters} m²</TableCell>
                    <TableCell className="text-right text-green-600">{formatCurrency(wall.margin)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(wall.totalCost)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t-2">
                  <TableCell colSpan={4} className="text-right font-semibold">Total:</TableCell>
                  <TableCell className="text-right font-semibold text-green-600">{formatCurrency(totalMargin)}</TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(totalCost)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};
