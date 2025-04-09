
import React from "react";
import { formatCurrency } from "@/utils/format";

interface CalculationResultsProps {
  squareMeters: number;
  marginAmount: number;
  totalCost: number;
  marginRate: number;
  ratePerSquareMeter: number;
}

export const CalculationResults: React.FC<CalculationResultsProps> = ({
  squareMeters,
  marginAmount,
  totalCost,
  marginRate,
  ratePerSquareMeter,
}) => {
  return (
    <div className="mt-2 bg-slate-50 p-4 rounded-md">
      <h3 className="font-medium mb-2">Calculation Results:</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Square Meters:</p>
          <p className="text-lg font-medium">{squareMeters} m²</p>
          <p className="text-xs text-muted-foreground mt-1">((Height 1 + Height 2) ÷ 2) × Length</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Margin Amount:</p>
          <p className="text-lg font-medium text-green-600">{formatCurrency(marginAmount)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {squareMeters} m² × {formatCurrency(marginRate)}/m²
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Cost:</p>
          <p className="text-lg font-medium">{formatCurrency(totalCost)}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {squareMeters} m² × {formatCurrency(ratePerSquareMeter)}/m²
          </p>
        </div>
      </div>
    </div>
  );
};
