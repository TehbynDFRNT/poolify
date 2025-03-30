
import { Calculator, ArrowRight } from "lucide-react";

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

export const CostBreakdown = ({
  perMeterCost,
  materialCost,
  labourCost,
  totalCost,
  marginCost,
  pavingDetails,
  concreteDetails,
  labourDetails,
  meters
}: CostBreakdownProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex items-center mb-4">
        <Calculator className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-medium">Cost Breakdown</h3>
      </div>
      
      {/* Per Meter Calculation Breakdown */}
      <div className="mb-4 border-b pb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Per Metre Calculation</h4>
        
        <div className="space-y-1 mb-3">
          {pavingDetails && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Paver Cost:</span>
                <span className="font-medium">${pavingDetails.paverCost?.toFixed(2) ?? '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Wastage Cost:</span>
                <span className="font-medium">${pavingDetails.wastageCost?.toFixed(2) ?? '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Margin Cost:</span>
                <span className="font-medium">${pavingDetails.marginCost?.toFixed(2) ?? '0.00'}</span>
              </div>
            </>
          )}
          
          {concreteDetails && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Concrete Cost:</span>
                <span className="font-medium">${concreteDetails.concreteCost?.toFixed(2) ?? '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Dust Cost:</span>
                <span className="font-medium">${concreteDetails.dustCost?.toFixed(2) ?? '0.00'}</span>
              </div>
            </>
          )}
          
          {labourDetails && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Labour Base Cost:</span>
                <span className="font-medium">${labourDetails.baseCost?.toFixed(2) ?? '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Labour Margin:</span>
                <span className="font-medium">${labourDetails.marginCost?.toFixed(2) ?? '0.00'}</span>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-2 font-semibold">
          <span>Per Metre Rate:</span>
          <span>${perMeterCost.toFixed(2)}</span>
        </div>
      </div>
      
      {/* Total Cost Calculation */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Total Project Cost</h4>
        
        <div className="flex items-center justify-center space-x-2 mb-3 bg-gray-100 p-2 rounded-md">
          <div className="text-center">
            <div className="text-sm text-gray-600">Per Metre</div>
            <div className="font-medium">${perMeterCost.toFixed(2)}</div>
          </div>
          <div className="text-gray-400">×</div>
          <div className="text-center">
            <div className="text-sm text-gray-600">Metres</div>
            <div className="font-medium">{meters}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-gray-400" />
          <div className="text-center">
            <div className="text-sm text-gray-600">Total Cost</div>
            <div className="font-bold">${totalCost.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      {/* Cost Category Breakdown */}
      <div className="space-y-2">
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
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
          <span>Total Cost:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
