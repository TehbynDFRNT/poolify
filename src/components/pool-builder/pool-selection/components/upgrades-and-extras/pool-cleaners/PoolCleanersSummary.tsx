
import React from "react";
import { PoolCleaner } from "@/types/pool-cleaner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";

interface PoolCleanersSummaryProps {
  selectedCleaner: PoolCleaner | null;
  includeCleaner: boolean;
  totalCost: number;
}

export const PoolCleanersSummary: React.FC<PoolCleanersSummaryProps> = ({
  selectedCleaner,
  includeCleaner,
  totalCost
}) => {
  if (!includeCleaner || !selectedCleaner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pool Cleaner Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            No pool cleaner selected. Enable the pool cleaner option to see costs and details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Pool Cleaner Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Pool Cleaner:</span>
            <span className="font-medium">{selectedCleaner.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Model:</span>
            <span>{selectedCleaner.model_number}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="grid grid-cols-2 gap-2">
              <span className="font-medium">Total Cost:</span>
              <span className="font-bold text-right">{formatCurrency(totalCost)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
