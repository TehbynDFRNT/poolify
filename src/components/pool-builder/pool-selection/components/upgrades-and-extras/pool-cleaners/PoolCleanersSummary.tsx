
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { PoolCleaner } from "@/types/pool-cleaner";
import { Check, X } from "lucide-react";

interface PoolCleanersSummaryProps {
  selectedCleaner: PoolCleaner | null;
  includeCleaner: boolean;
  totalCost: number;
}

export const PoolCleanersSummary: React.FC<PoolCleanersSummaryProps> = ({
  selectedCleaner,
  includeCleaner,
  totalCost,
}) => {
  if (!includeCleaner || !selectedCleaner) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">No pool cleaner selected</p>
            <div className="flex items-center gap-2 text-amber-600">
              <X className="h-4 w-4" />
              <span>Not included</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Selected Pool Cleaner</h3>
            <div className="flex items-center gap-2 text-green-600">
              <Check className="h-4 w-4" />
              <span>Included</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">{selectedCleaner.name}</p>
              <p className="text-sm text-muted-foreground">{selectedCleaner.description}</p>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between border-t pt-1 mt-1">
                <p className="text-sm font-medium">Total Cost:</p>
                <p className="font-bold">{formatCurrency(totalCost)}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
