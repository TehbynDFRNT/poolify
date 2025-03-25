
import React from 'react';
import { formatCurrency } from "@/utils/format";

interface MarginDisplayProps {
  marginPercentage: number;
  rrp: number;
  actualMargin: number;
}

export const MarginDisplay = ({ marginPercentage, rrp, actualMargin }: MarginDisplayProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      <div className="bg-primary/10 rounded-lg p-4 space-y-2">
        <div className="text-sm text-primary">
          Margin Percentage
        </div>
        <div className="text-lg font-bold">
          {marginPercentage.toFixed(1)}%
        </div>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-4 space-y-2">
        <div className="text-sm text-primary">
          Recommended Retail Price
        </div>
        <div className="text-lg font-bold">
          {formatCurrency(rrp)}
        </div>
      </div>
      
      <div className="bg-primary/10 rounded-lg p-4 space-y-2">
        <div className="text-sm text-primary">
          Actual Margin
        </div>
        <div className="text-lg font-bold">
          {formatCurrency(actualMargin)}
        </div>
      </div>
    </div>
  );
};
