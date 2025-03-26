
import { Calculator } from "lucide-react";

interface CostBreakdownProps {
  perMeterCost: number;
  materialCost: number;
  labourCost: number;
  totalCost: number;
}

export const CostBreakdown = ({
  perMeterCost,
  materialCost,
  labourCost,
  totalCost
}: CostBreakdownProps) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <div className="flex items-center mb-4">
        <Calculator className="h-5 w-5 text-primary mr-2" />
        <h3 className="font-medium">Cost Breakdown</h3>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Per Metre Cost:</span>
          <span className="font-medium">${perMeterCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Material Cost:</span>
          <span className="font-medium">${materialCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Labour Cost:</span>
          <span className="font-medium">${labourCost.toFixed(2)}</span>
        </div>
        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
          <span>Total Cost:</span>
          <span>${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
