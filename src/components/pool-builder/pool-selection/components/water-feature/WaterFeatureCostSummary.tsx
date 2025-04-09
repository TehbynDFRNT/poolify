
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface WaterFeatureCostSummaryProps {
  basePrice: number;
  backCladdingPrice: number;
  bladePrice: number;
  totalCost: number;
  hasBackCladding: boolean;
  selectedBlade: string;
}

export const WaterFeatureCostSummary: React.FC<WaterFeatureCostSummaryProps> = ({
  basePrice,
  backCladdingPrice,
  bladePrice,
  totalCost,
  hasBackCladding,
  selectedBlade,
}) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="font-medium">Item</span>
            <span className="font-medium">Cost</span>
          </div>
          
          {/* Base water feature cost */}
          <div className="flex justify-between items-center">
            <span>Water Feature Base</span>
            <span>${basePrice.toLocaleString()}</span>
          </div>
          
          {/* Back cladding if selected */}
          {hasBackCladding && (
            <div className="flex justify-between items-center">
              <span>Back Cladding</span>
              <span>${backCladdingPrice.toLocaleString()}</span>
            </div>
          )}
          
          {/* LED Blade if selected */}
          {selectedBlade !== "none" && bladePrice > 0 && (
            <div className="flex justify-between items-center">
              <span>{selectedBlade} LED Blade</span>
              <span>${bladePrice.toLocaleString()}</span>
            </div>
          )}
          
          {/* Total cost */}
          <div className="flex justify-between items-center pt-2 border-t font-bold">
            <span>Total Cost</span>
            <span>${totalCost.toLocaleString()}</span>
          </div>
          
          <p className="text-xs text-muted-foreground italic mt-2">
            All prices include margin — no additional markup needed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
