
import React from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";

interface HeatingOptionsSummaryProps {
  totalCost: number;
  totalMargin: number;
  isSaving: boolean;
  onSave: () => Promise<void>;
  customerId: string | null;
}

export const HeatingOptionsSummary: React.FC<HeatingOptionsSummaryProps> = ({
  totalCost,
  totalMargin,
  isSaving,
  onSave,
  customerId
}) => {
  if (totalCost === 0) {
    return null;
  }

  return (
    <div className="bg-primary/10 p-4 rounded-md">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Total Heating Options:</h3>
          <p className="text-lg font-bold">{formatCurrency(totalCost)}</p>
        </div>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <span>Total Margin:</span>
          <span>{formatCurrency(totalMargin)}</span>
        </div>
      </div>
      
      <div className="mt-3 flex justify-end">
        <Button 
          disabled={!customerId || isSaving} 
          onClick={onSave}
        >
          {isSaving ? 'Saving...' : 'Save Heating Options'}
        </Button>
      </div>
    </div>
  );
};
