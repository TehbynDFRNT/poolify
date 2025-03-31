
import React from "react";

interface CostBreakdownProps {
  perMeterCost: number;
  materialCost: number;
  labourCost: number;
  marginCost: number;
  totalCost: number;
  pavingDetails: any;
  concreteDetails: any;
  labourDetails: any;
  meters: number;
}

export const CostBreakdown = ({
  perMeterCost = 0,
  materialCost = 0,
  labourCost = 0,
  marginCost = 0,
  totalCost = 0,
  pavingDetails = {},
  concreteDetails = {},
  labourDetails = {},
  meters = 0
}: CostBreakdownProps) => {
  // Add default values to prevent undefined errors
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Cost Breakdown</h3>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Material Costs</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Paver Cost:</span>
              <span>${(pavingDetails?.paver_cost || 0).toFixed(2)}/m</span>
            </div>
            <div className="flex justify-between">
              <span>Wastage Cost:</span>
              <span>${(pavingDetails?.wastage_cost || 0).toFixed(2)}/m</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Material Margin:</span>
              <span>${(pavingDetails?.margin_cost || 0).toFixed(2)}/m</span>
            </div>
            <div className="border-t pt-2 mt-1">
              <div className="flex justify-between font-medium">
                <span>Total Material Cost (per m):</span>
                <span>${materialCost.toFixed(2)}/m</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Materials Cost:</span>
                <span>${(materialCost * meters).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="font-medium mb-2">Labour Costs</h4>
          <div className="space-y-2">
            {labourDetails && Object.entries(labourDetails).map(([key, value]: [string, any]) => (
              <React.Fragment key={key}>
                {value && (
                  <>
                    <div className="flex justify-between">
                      <span>{value.description || 'Labour'}:</span>
                      <span>${(value.cost || 0).toFixed(2)}/m</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Labour Margin:</span>
                      <span>${(value.margin || 0).toFixed(2)}/m</span>
                    </div>
                  </>
                )}
              </React.Fragment>
            ))}
            <div className="border-t pt-2 mt-1">
              <div className="flex justify-between font-medium">
                <span>Total Labour Cost (per m):</span>
                <span>${labourCost.toFixed(2)}/m</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total Labour Cost:</span>
                <span>${(labourCost * meters).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-md mt-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-lg font-medium">Total Cost:</span>
            <div className="text-sm text-gray-600">${perMeterCost.toFixed(2)} per meter × {meters} meters</div>
          </div>
          <span className="text-xl font-bold">${totalCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mt-2 text-green-600">
          <span className="font-medium">Total Margin:</span>
          <span className="font-medium">${(marginCost * meters).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
