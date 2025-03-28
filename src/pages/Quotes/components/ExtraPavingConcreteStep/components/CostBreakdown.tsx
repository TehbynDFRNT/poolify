
import React from "react";

interface CostBreakdownProps {
  perMeterCost: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
  marginCost: number;
  pavingDetails?: {
    category?: string;
    paverCost?: number;
    wastageCost?: number;
    marginCost?: number;
  };
  concreteDetails?: {
    concreteCost?: number;
    dustCost?: number;
  };
  labourDetails?: {
    baseCost?: number;
    marginCost?: number;
  };
  meters: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  perMeterCost,
  materialCost,
  labourCost,
  totalCost,
  marginCost,
  pavingDetails,
  concreteDetails,
  labourDetails,
  meters
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <h4 className="font-medium mb-2">Cost Summary</h4>
      <div className="grid grid-cols-2 gap-y-2">
        <div>Paving Cost:</div>
        <div className="text-right">${materialCost.toFixed(2)}</div>
        
        <div>Labour Cost:</div>
        <div className="text-right">${labourCost.toFixed(2)}</div>
        
        <div>Margin:</div>
        <div className="text-right">${marginCost.toFixed(2)}</div>
        
        <div>Area:</div>
        <div className="text-right">{meters} m²</div>
        
        <div>Rate per m²:</div>
        <div className="text-right">${perMeterCost.toFixed(2)}</div>
        
        <div className="font-medium border-t pt-2 mt-2">Total Cost:</div>
        <div className="text-right font-medium border-t pt-2 mt-2">${totalCost.toFixed(2)}</div>
      </div>
    </div>
  );
};
