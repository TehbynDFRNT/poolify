
import React from "react";

interface CostBreakdownProps {
  perMeterRate: number;
  materialCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
  pavingDetails?: {
    paverCost?: number;
    wastageCost?: number;
    marginCost?: number;
  };
  labourDetails?: {
    baseCost?: number;
    marginCost?: number;
  };
  meters: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  perMeterRate,
  materialCost,
  labourCost,
  marginCost,
  totalCost,
  pavingDetails,
  labourDetails,
  meters
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <h4 className="font-medium mb-2">Cost Breakdown</h4>
      
      {/* Per Meter Rate Breakdown */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-1">Per Metre Rate</div>
        <div className="space-y-1">
          {pavingDetails && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paver Cost:</span>
                <span className="font-medium">${pavingDetails.paverCost?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Wastage Cost:</span>
                <span className="font-medium">${pavingDetails.wastageCost?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Margin Cost:</span>
                <span className="font-medium">${pavingDetails.marginCost?.toFixed(2) || '0.00'}</span>
              </div>
            </>
          )}
          
          {labourDetails && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Labour Base Cost:</span>
                <span className="font-medium">${labourDetails.baseCost?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Labour Margin Cost:</span>
                <span className="font-medium">${labourDetails.marginCost?.toFixed(2) || '0.00'}</span>
              </div>
            </>
          )}
          
          <div className="flex justify-between text-sm font-semibold pt-1">
            <span>Total Per Metre:</span>
            <span>${perMeterRate.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {/* Total Cost Calculation */}
      <div className="mb-3 pb-3 border-b border-gray-200">
        <div className="text-sm font-medium text-gray-700 mb-1">Total Calculation</div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">${perMeterRate.toFixed(2)} × {meters.toFixed(1)} metres =</span>
          <span className="font-semibold">${totalCost.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Cost Category Breakdown */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Material Cost:</span>
          <span className="font-medium">${materialCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Labour Cost:</span>
          <span className="font-medium">${labourCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600">
          <span>Margin:</span>
          <span className="font-medium">${marginCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-blue-600 pt-2 mt-1 border-t border-gray-200">
          <span>Total Cost:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
