
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WaterFeatureCostSummaryProps {
  basePrice: number;
  backCladdingPrice: number;
  bladePrice: number;
  totalCost: number;
  hasBackCladding: boolean;
  selectedBlade: string;
  baseMargin?: number;
  backCladdingMargin?: number;
  bladeMargin?: number;
}

export const WaterFeatureCostSummary: React.FC<WaterFeatureCostSummaryProps> = ({
  basePrice,
  backCladdingPrice,
  bladePrice,
  totalCost,
  hasBackCladding,
  selectedBlade,
  baseMargin = 800,
  backCladdingMargin = 300,
  bladeMargin = 100,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Item</span>
            <div className="flex items-center gap-4">
              <span className="font-medium text-muted-foreground">Margin</span>
              <span className="font-medium min-w-[80px] text-right">Cost</span>
            </div>
          </div>
          
          {/* Base water feature cost */}
          <div className="flex justify-between items-center">
            <span>Water Feature Base</span>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground min-w-[80px] text-right">${baseMargin.toLocaleString()}</span>
              <span className="min-w-[80px] text-right">${basePrice.toLocaleString()}</span>
            </div>
          </div>
          
          {/* Back cladding if selected */}
          {hasBackCladding && (
            <div className="flex justify-between items-center">
              <span>Back Cladding</span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground min-w-[80px] text-right">${backCladdingMargin.toLocaleString()}</span>
                <span className="min-w-[80px] text-right">${backCladdingPrice.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          {/* LED Blade if selected */}
          {selectedBlade !== "none" && bladePrice > 0 && (
            <div className="flex justify-between items-center">
              <span>{selectedBlade}</span>
              <div className="flex items-center gap-4">
                <span className="text-muted-foreground min-w-[80px] text-right">${bladeMargin.toLocaleString()}</span>
                <span className="min-w-[80px] text-right">${bladePrice.toLocaleString()}</span>
              </div>
            </div>
          )}
          
          {/* Total cost */}
          <div className="flex justify-between items-center pt-2 border-t font-bold">
            <span>Total Cost</span>
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground min-w-[80px] text-right">
                ${(baseMargin + (hasBackCladding ? backCladdingMargin : 0) + (selectedBlade !== "none" ? bladeMargin : 0)).toLocaleString()}
              </span>
              <span className="min-w-[80px] text-right">${totalCost.toLocaleString()}</span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground italic mt-2">
            All prices include margin — no additional markup needed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
