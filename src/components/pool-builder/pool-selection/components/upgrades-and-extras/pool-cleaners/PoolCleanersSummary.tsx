import React from "react";
import { PoolCleaner } from "@/types/pool-cleaner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
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
  const fmt = (value: number) => formatCurrency(value);
  const margin = selectedCleaner?.margin || 0;

  return (
    <Card>
      <CardHeader className="bg-white">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg font-medium">
            Pool Cleaner Summary
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        {!includeCleaner || !selectedCleaner ? (
          <div className="text-center py-4 text-muted-foreground">
            No pool cleaner selected
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 font-medium">Item</th>
                    <th className="text-right py-2 font-medium">Margin</th>
                    <th className="text-right py-2 font-medium">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">
                      {selectedCleaner.name}
                      {selectedCleaner.model_number && (
                        <span className="text-sm text-muted-foreground ml-2">
                          ({selectedCleaner.model_number})
                        </span>
                      )}
                    </td>
                    <td className="text-right py-2 text-green-600">{fmt(margin)}</td>
                    <td className="text-right py-2">{fmt(totalCost)}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t-2">
                    <td className="pt-3 font-semibold">Total Pool Cleaner:</td>
                    <td className="text-right pt-3 font-semibold text-green-600">{fmt(margin)}</td>
                    <td className="text-right pt-3 font-semibold">{fmt(totalCost)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};