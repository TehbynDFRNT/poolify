
import React from 'react';
import { formatCurrency } from "@/utils/format";

interface CostBreakdownItemProps {
  name: string;
  value: number;
}

export const CostBreakdownItem = ({ name, value }: CostBreakdownItemProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
      <div className="text-sm text-muted-foreground">
        {name}
      </div>
      <div className="text-sm font-medium">
        {formatCurrency(value)}
      </div>
    </div>
  );
};
