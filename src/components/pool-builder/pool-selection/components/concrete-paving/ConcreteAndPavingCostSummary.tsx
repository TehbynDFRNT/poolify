
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import { useConcretePavingSummary } from "@/hooks/useConcretePavingSummary";
import { SummaryContent } from "./summary/SummaryContent";
import { CostTotals } from "./summary/CostTotals";
import { Pool } from "@/types/pool";
import { SaveAllButton } from "./SaveAllButton";
import { useSaveAll } from "@/components/pool-builder/pool-selection/hooks/useSaveAll";

interface ConcreteAndPavingCostSummaryProps {
  pool: Pool;
  customerId: string;
}

export const ConcreteAndPavingCostSummary: React.FC<ConcreteAndPavingCostSummaryProps> = ({ 
  pool, 
  customerId 
}) => {
  const { summaryData, isLoading } = useConcretePavingSummary(customerId);
  const { isSubmittingAll, handleSaveAll } = useSaveAll(customerId, async () => {
    // In a real implementation, this would save all sections
    return Promise.resolve();
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between bg-muted/50 pb-2">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-semibold">Concrete & Paving Summary</CardTitle>
        </div>
        
        <SaveAllButton 
          onSaveAll={handleSaveAll} 
          isSubmitting={isSubmittingAll}
          className="hidden sm:flex"
        />
      </CardHeader>
      <CardContent className="pt-4">
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        ) : (
          <>
            <SummaryContent summaryData={summaryData} />
            <CostTotals summaryData={summaryData} />
            
            <div className="flex justify-end mt-4 sm:hidden">
              <SaveAllButton 
                onSaveAll={handleSaveAll} 
                isSubmitting={isSubmittingAll}
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
