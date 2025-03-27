
import React from "react";

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
  perMeterRate,
  pavingCost,
  labourCost,
  marginCost,
  totalCost,
  paverCost = 0,
  wastageCost = 0,
  marginPaverCost = 0,
  labourBaseCost = 0,
  labourMarginCost = 0,
  meters
}) => {
  return (
    <div className="mt-4 bg-gray-50 p-4 rounded-md">
      <h4 className="font-medium mb-2">Cost Summary</h4>
      <div className="grid grid-cols-2 gap-y-2">
        <div>Paving Cost:</div>
        <div className="text-right">${pavingCost.toFixed(2)}</div>
        
        <div>Labour Cost:</div>
        <div className="text-right">${labourCost.toFixed(2)}</div>
        
        <div>Margin:</div>
        <div className="text-right">${marginCost.toFixed(2)}</div>
        
        <div>Area:</div>
        <div className="text-right">{meters} m²</div>
        
        <div>Rate per m²:</div>
        <div className="text-right">${perMeterRate.toFixed(2)}</div>
        
        <div className="font-medium border-t pt-2 mt-2">Total Cost:</div>
        <div className="text-right font-medium border-t pt-2 mt-2">${totalCost.toFixed(2)}</div>
      </div>
    </div>
  );
};
