
import React from "react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card>
      <CardContent className="pt-6 space-y-4">
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
        
        {customerId && (
          <div className="flex justify-end">
            <Button 
              disabled={isSaving} 
              onClick={onSave}
              className="flex items-center gap-2"
            >
              {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {isSaving ? 'Saving...' : 'Save Heating Options'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
