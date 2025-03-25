
import React from 'react';
import { formatCurrency } from "@/utils/format";

interface MarginDisplayProps {
  marginPercentage: number;
  rrp: number;
  actualMargin: number;
}

export const MarginDisplay = ({ marginPercentage, rrp, actualMargin }: MarginDisplayProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            Margin %
          </div>
          <div className="text-sm font-medium">
            {marginPercentage.toFixed(2)}%
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            RRP
          </div>
          <div className="text-sm font-medium text-primary">
            {formatCurrency(rrp)}
          </div>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
          <div className="text-sm text-muted-foreground">
            Actual Margin
          </div>
          <div className="text-sm font-medium text-primary">
            {formatCurrency(actualMargin)}
          </div>
        </div>
      </div>
    </div>
  );
};
