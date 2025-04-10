
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CostCalculation } from "../types";
import CostItem from "./CostItem";

interface CostSummaryProps {
  costs: CostCalculation;
}

const CostSummary: React.FC<CostSummaryProps> = ({ costs }) => {
  return (
    <Card className="bg-muted/40">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <h3 className="font-medium text-lg">Cost Summary</h3>
          
          <div className="space-y-1 text-sm divide-y">
            <div className="space-y-1 pb-2">
              <CostItem label="Fence Linear Cost" amount={costs.linearCost} />
              <CostItem label="Gates Cost" amount={costs.gatesCost} />
              
              {costs.freeGateDiscount !== 0 && (
                <CostItem 
                  label="Free Gate Discount" 
                  amount={Math.abs(costs.freeGateDiscount)} 
                  isDiscount 
                />
              )}
            </div>
            
            <div className="space-y-1 py-2">
              <CostItem label="Simple Panels Cost" amount={costs.simplePanelsCost} />
              <CostItem label="Complex Panels Cost" amount={costs.complexPanelsCost} />
            </div>
            
            {costs.earthingCost > 0 && (
              <div className="py-2">
                <CostItem label="Earthing Cost" amount={costs.earthingCost} />
              </div>
            )}
            
            <div className="pt-2">
              <CostItem label="Total Cost" amount={costs.totalCost} isTotal />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CostSummary;
