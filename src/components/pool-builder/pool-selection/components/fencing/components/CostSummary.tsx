
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CostCalculation } from "../types";

interface CostSummaryProps {
  costs: CostCalculation;
}

const CostSummary: React.FC<CostSummaryProps> = ({ costs }) => {
  return (
    <Card className="bg-muted/40">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Cost Summary</h3>
          
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Fence Linear Cost:</span>
              <span>${costs.linearCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Gates Cost:</span>
              <span>${costs.gatesCost.toFixed(2)}</span>
            </div>
            {costs.freeGateDiscount !== 0 && (
              <div className="flex justify-between text-green-600">
                <span>Free Gate Discount:</span>
                <span>${costs.freeGateDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Simple Panels Cost:</span>
              <span>${costs.simplePanelsCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Complex Panels Cost:</span>
              <span>${costs.complexPanelsCost.toFixed(2)}</span>
            </div>
            {costs.earthingCost > 0 && (
              <div className="flex justify-between">
                <span>Earthing Cost:</span>
                <span>${costs.earthingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold pt-2 border-t mt-2">
              <span>Total Cost:</span>
              <span>${costs.totalCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
