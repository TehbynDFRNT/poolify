
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CostItem } from "./components/CostItem";
import { TotalCostItem } from "./components/TotalCostItem";
import { WaterFeatureSummary } from "@/types/water-feature";

interface WaterFeatureCostSummaryProps {
  summary: WaterFeatureSummary;
  hasBackCladding: boolean;
}

export const WaterFeatureCostSummary: React.FC<WaterFeatureCostSummaryProps> = ({
  summary,
  hasBackCladding,
}) => {
  const { 
    basePrice, 
    baseMargin, 
    backCladdingPrice, 
    backCladdingMargin, 
    bladePrice, 
    bladeMargin, 
    totalCost, 
    selectedBladeName 
  } = summary;

  const totalMargin = baseMargin + 
    (hasBackCladding ? backCladdingMargin : 0) + 
    (selectedBladeName !== "None" ? bladeMargin : 0);

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
          <CostItem 
            label="Water Feature Base" 
            cost={basePrice} 
            margin={baseMargin} 
            showZero={true}
          />
          
          {/* Back cladding if selected */}
          {hasBackCladding && (
            <CostItem 
              label="Back Cladding" 
              cost={backCladdingPrice} 
              margin={backCladdingMargin}
            />
          )}
          
          {/* LED Blade if selected */}
          {selectedBladeName !== "None" && bladePrice > 0 && (
            <CostItem 
              label={selectedBladeName} 
              cost={bladePrice} 
              margin={bladeMargin}
            />
          )}
          
          {/* Total cost */}
          <TotalCostItem totalCost={totalCost} totalMargin={totalMargin} />
          
          <p className="text-xs text-muted-foreground italic mt-2">
            All prices include margin — no additional markup needed
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
