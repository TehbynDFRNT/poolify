
import React, { Fragment } from "react";
import { PavingSelection } from "../types";
import type { ConcreteLabourCost } from "@/types/concrete-labour-cost";

interface CostBreakdownProps {
  activeSelection: PavingSelection;
  concreteLabourCosts?: ConcreteLabourCost[];
}

export const CostBreakdown = ({ activeSelection, concreteLabourCosts = [] }: CostBreakdownProps) => {
  // Material costs per meter (Paving)
  const totalMaterialCost = activeSelection.paverCost + activeSelection.wastageCost + activeSelection.marginCost;
  
  // Labor costs per meter from database (Laying)
  const laborCosts = concreteLabourCosts.reduce((total, cost) => {
    return total + cost.cost;
  }, 0);
  
  // Labor margin per meter from database
  const laborMargin = concreteLabourCosts.reduce((total, cost) => {
    return total + cost.margin;
  }, 0);
  
  const totalLabourCost = laborCosts + laborMargin;
  
  // Ensure meters is a valid number
  const meters = activeSelection.meters === undefined || isNaN(activeSelection.meters) ? 0 : activeSelection.meters;
  
  // Total costs for all meters
  const totalMaterialCostAll = totalMaterialCost * meters;
  const totalLabourCostAll = totalLabourCost * meters;
  
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2">
      <div className="col-span-2 mt-2 mb-1">
        <h3 className="font-semibold text-gray-700">Cost Breakdown</h3>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Materials (per meter)</h4>
        <div className="grid grid-cols-2 gap-y-1">
          <div>Paver Cost:</div>
          <div className="text-right">${activeSelection.paverCost.toFixed(2)}</div>
          
          <div>Wastage Cost:</div>
          <div className="text-right">${activeSelection.wastageCost.toFixed(2)}</div>
          
          <div>Material Margin:</div>
          <div className="text-right text-green-600">${activeSelection.marginCost.toFixed(2)}</div>
          
          <div className="border-t pt-1 mt-1 font-medium">Total Material Cost (per m):</div>
          <div className="text-right border-t pt-1 mt-1 font-medium">${totalMaterialCost.toFixed(2)}</div>
          
          <div className="font-medium">Total Materials Cost:</div>
          <div className="text-right font-medium">${totalMaterialCostAll.toFixed(2)}</div>
        </div>
      </div>
      
      <div className="bg-slate-50 p-4 rounded-md">
        <h4 className="font-medium mb-2">Labour (per meter)</h4>
        <div className="grid grid-cols-2 gap-y-1">
          {concreteLabourCosts.map((cost, index) => (
            <Fragment key={cost.id}>
              <div>{cost.description}:</div>
              <div className="text-right">${cost.cost.toFixed(2)}</div>
              
              <div>{cost.description} Margin:</div>
              <div className="text-right text-green-600">${cost.margin.toFixed(2)}</div>
              
              {index < concreteLabourCosts.length - 1 && (
                <Fragment>
                  <div className="border-b my-1"></div>
                  <div className="border-b my-1"></div>
                </Fragment>
              )}
            </Fragment>
          ))}
          
          {concreteLabourCosts.length === 0 && (
            <Fragment>
              <div>Concrete Labour costs not loaded</div>
              <div className="text-right">$0.00</div>
            </Fragment>
          )}
          
          <div className="border-t pt-1 mt-1 font-medium">Total Labour Cost (per m):</div>
          <div className="text-right border-t pt-1 mt-1 font-medium">${totalLabourCost.toFixed(2)}</div>
          
          <div className="font-medium">Total Labour Cost:</div>
          <div className="text-right font-medium">${totalLabourCostAll.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};
