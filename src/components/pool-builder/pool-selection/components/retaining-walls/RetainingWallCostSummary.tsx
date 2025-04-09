
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRetainingWallSummary } from "./hooks/useRetainingWallSummary";
import { SummaryTable } from "./components/SummaryTable";
import { SummaryLoading } from "./components/SummaryLoading";
import { EmptySummary } from "./components/EmptySummary";

interface RetainingWallCostSummaryProps {
  customerId: string | null;
  updateCounter?: number; // Used to trigger refetches
}

export const RetainingWallCostSummary: React.FC<RetainingWallCostSummaryProps> = ({ 
  customerId,
  updateCounter = 0
}) => {
  // Use custom hook for data fetching and automatic refetching
  const { data, isLoading } = useRetainingWallSummary(customerId, updateCounter);
  
  const { walls, totalMargin, totalCost } = data;
  
  // Don't render anything if no walls have data
  if ((!walls || walls.length === 0) && !isLoading) {
    return null;
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl font-semibold">Retaining Walls Cost Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SummaryLoading />
        ) : walls.length > 0 ? (
          <SummaryTable 
            walls={walls} 
            totalMargin={totalMargin} 
            totalCost={totalCost} 
          />
        ) : (
          <EmptySummary />
        )}
      </CardContent>
    </Card>
  );
};
