
import React from "react";
import { formatCurrency } from "@/utils/format";

interface CostBreakdownProps {
  perMeterRate: number;
  pavingCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
  paverCost?: number;
  wastageCost?: number;
  marginPaverCost?: number;
  labourBaseCost?: number;
  labourMarginCost?: number;
  meters: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  perMeterRate = 0,
  pavingCost = 0,
  labourCost = 0,
  marginCost = 0,
  totalCost = 0,
  paverCost = 0,
  wastageCost = 0,
  marginPaverCost = 0,
  labourBaseCost = 0,
  labourMarginCost = 0,
  meters = 0
}) => {
  // Ensure all numeric values have defaults to prevent undefined errors
  const safePerMeterRate = perMeterRate || 0;
  const safePavingCost = pavingCost || 0;
  const safeLabourCost = labourCost || 0;
  const safeMarginCost = marginCost || 0;
  const safeTotalCost = totalCost || 0;
  const safePaverCost = paverCost || 0;
  const safeWastageCost = wastageCost || 0;
  const safeMarginPaverCost = marginPaverCost || 0;
  const safeLabourBaseCost = labourBaseCost || 0;
  const safeLabourMarginCost = labourMarginCost || 0;
  const safeMeters = meters || 0;

  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-md">
      <h4 className="font-medium mb-2">Cost Summary</h4>
      <div className="grid grid-cols-2 gap-y-2">
        <div>Paving Cost:</div>
        <div className="text-right">${safePavingCost.toFixed(2)}</div>
        
        <div>Labour Cost:</div>
        <div className="text-right">${safeLabourCost.toFixed(2)}</div>
        
        <div>Margin:</div>
        <div className="text-right">${safeMarginCost.toFixed(2)}</div>
        
        <div>Area:</div>
        <div className="text-right">{safeMeters} m²</div>
        
        <div>Rate per m²:</div>
        <div className="text-right">${safePerMeterRate.toFixed(2)}</div>
        
        <div className="font-medium border-t pt-2 mt-2">Total Cost:</div>
        <div className="text-right font-medium border-t pt-2 mt-2">${safeTotalCost.toFixed(2)}</div>
      </div>
    </div>
  );
};
