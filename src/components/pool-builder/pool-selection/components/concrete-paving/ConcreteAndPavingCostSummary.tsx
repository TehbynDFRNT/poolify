
import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { SummaryContent } from "./summary/SummaryContent";
import { CostTotals } from "./summary/CostTotals";
import { useConcretePavingSummary } from "@/hooks/useConcretePavingSummary";
import { Pool } from "@/types/pool";

interface ConcreteAndPavingCostSummaryProps {
  pool: Pool;
  customerId: string;
}

export const ConcreteAndPavingCostSummary: React.FC<ConcreteAndPavingCostSummaryProps> = ({ 
  pool, 
  customerId 
}) => {
  const { 
    summaryData, 
    isLoading, 
    error,
    refreshSummary 
  } = useConcretePavingSummary(customerId);

  // Refresh the summary data when the component mounts
  useEffect(() => {
    refreshSummary();
  }, [refreshSummary]);

  return (
    <Card>
      <CardHeader className="bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-medium">
              Concrete & Paving Summary
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">
            Loading summary data...
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            Error loading summary data. Please try again.
          </div>
        ) : (
          <>
            <SummaryContent summaryData={summaryData} />
            <CostTotals summaryData={summaryData} />
          </>
        )}
      </CardContent>
    </Card>
  );
};
