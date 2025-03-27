
import React from 'react';

interface CostBreakdownProps {
  pavingCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  pavingCost,
  labourCost,
  marginCost,
  totalCost
}) => {
  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
      <h4 className="font-medium mb-2">Cost Breakdown</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Paving Material:</span>
          <span className="font-medium">${pavingCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Labour:</span>
          <span className="font-medium">${labourCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Margin:</span>
          <span className="font-medium">${marginCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-200">
          <span className="font-medium">Total Cost:</span>
          <span className="font-bold text-blue-600">${totalCost.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
