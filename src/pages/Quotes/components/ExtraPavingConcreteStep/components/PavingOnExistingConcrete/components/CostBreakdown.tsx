
import React from "react";
import { Calculator, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/format";

interface CostBreakdownProps {
  perMeterRate: number;
  materialCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
  pavingDetails: {
    paverCost: number;
    wastageCost: number;
    marginCost: number;
  };
  labourDetails: {
    baseCost: number;
    marginCost: number;
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
    <div className="bg-gray-50 p-5 rounded-md border border-gray-200">
      <div className="flex items-center mb-4">
        <Calculator className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-medium">Cost Breakdown</h3>
      </div>
      
      {/* Per Metre Calculation */}
      <div className="mb-4 border-b pb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Per Metre Calculation</h4>
        
        <div className="space-y-1 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Paver Cost:</span>
            <span className="font-medium">{formatCurrency(pavingDetails.paverCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Wastage Cost:</span>
            <span className="font-medium">{formatCurrency(pavingDetails.wastageCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Margin Cost:</span>
            <span className="font-medium">{formatCurrency(pavingDetails.marginCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Labour Base Cost:</span>
            <span className="font-medium">{formatCurrency(labourDetails.baseCost)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Labour Margin:</span>
            <span className="font-medium">{formatCurrency(labourDetails.marginCost)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-2 font-semibold">
          <span>Per Metre Rate:</span>
          <span>{formatCurrency(perMeterRate)}</span>
        </div>
      </div>
      
      {/* Total Project Cost */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Total Project Cost</h4>
        
        <div className="flex items-center justify-center space-x-2 mb-3 bg-gray-100 p-3 rounded-md">
          <div className="text-center">
            <div className="text-sm text-gray-600">Per Metre</div>
            <div className="font-medium">{formatCurrency(perMeterRate)}</div>
          </div>
          <div className="text-gray-400">×</div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Metres</div>
            <div className="font-medium">{meters}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Cost</div>
            <div className="font-bold">{formatCurrency(totalCost)}</div>
          </div>
        </div>
      </div>
      
      {/* Cost Category Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Material Cost:</span>
          <span className="font-medium">{formatCurrency(materialCost)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Labour Cost:</span>
          <span className="font-medium">{formatCurrency(labourCost)}</span>
        </div>
        <div className="flex justify-between text-sm text-green-600">
          <span>Margin:</span>
          <span className="font-medium">{formatCurrency(marginCost)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
          <span>Total Cost:</span>
          <span>{formatCurrency(totalCost)}</span>
        </div>
      </div>
    </div>
  );
};
