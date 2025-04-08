
import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { Pool } from "@/types/pool";
import { useConcretePavingSummary } from "@/hooks/useConcretePavingSummary";
import { SummaryContent } from "./summary/SummaryContent";

interface ConcreteAndPavingCostSummaryProps {
  pool: Pool;
  customerId: string;
}

export const ConcreteAndPavingCostSummary: React.FC<ConcreteAndPavingCostSummaryProps> = ({ 
  pool, 
  customerId 
}) => {
  const { summaryData, isLoading } = useConcretePavingSummary(customerId);

  return (
    <Card>
      <CardHeader className="bg-secondary/20 pb-3">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-semibold">Concrete & Paving Cost Summary</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="text-center py-4 text-muted-foreground">Loading summary data...</div>
        ) : (
          <SummaryContent summaryData={summaryData} />
        )}
      </CardContent>
    </Card>
  );
};
