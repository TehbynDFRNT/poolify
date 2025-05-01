
import React from "react";
import { PoolCleaner } from "@/types/pool-cleaner";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CircleSlash, Check } from "lucide-react";

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
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-6 text-muted-foreground">
            <CircleSlash className="h-5 w-5 mr-2" />
            <p>No pool cleaner selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start justify-between border-b pb-2">
          <div>
            <div className="flex items-center">
              <Check className="h-4 w-4 text-green-500 mr-2" />
              <p className="font-medium">{selectedCleaner.name}</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Model: {selectedCleaner.model_number}
            </p>
          </div>
          <p className="font-medium">{formatCurrency(selectedCleaner.price)}</p>
        </div>
        <div className="flex items-center justify-between font-medium">
          <p>Total Cost:</p>
          <p>{formatCurrency(totalCost)}</p>
        </div>
      </CardContent>
    </Card>
  );
};
