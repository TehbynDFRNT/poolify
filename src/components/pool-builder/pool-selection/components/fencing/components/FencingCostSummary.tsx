
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFencingSummary } from "../hooks/useFencingSummary";
import { FencingSummaryTable } from "./FencingSummaryTable";
import { SummaryLoading } from "./SummaryLoading";
import { EmptySummary } from "./EmptySummary";

interface FencingCostSummaryProps {
  customerId: string | null;
  updateCounter?: number; // Used to trigger refetches
}

export const FencingCostSummary: React.FC<FencingCostSummaryProps> = ({ 
  customerId,
  updateCounter = 0
}) => {
  // Use custom hook for data fetching
  const { data, isLoading } = useFencingSummary(customerId, updateCounter);
  
  const { fencings, totalCost } = data;
  
  // Don't render anything if no fencing data available
  if ((!fencings || fencings.length === 0) && !isLoading) {
    return null;
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader className="bg-white">
        <CardTitle className="text-xl font-semibold">Fencing Cost Summary</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SummaryLoading />
        ) : fencings.length > 0 ? (
          <FencingSummaryTable 
            fencings={fencings} 
            totalCost={totalCost} 
          />
        ) : (
          <EmptySummary />
        )}
      </CardContent>
    </Card>
  );
};
