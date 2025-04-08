
import React from "react";
import { Pool } from "@/types/pool";
import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";
import { usePoolSelectionData } from "@/pages/Quotes/components/SelectPoolStep/hooks/usePoolSelectionData";
import { formatCurrency } from "@/utils/format";

interface PoolWebRRPContentProps {
  pool: Pool;
}

export const PoolWebRRPContent: React.FC<PoolWebRRPContentProps> = ({ pool }) => {
  // Get margin data for this pool
  const { marginData } = useMargin(pool.id);
  
  // Get total costs from pool selection data
  const { calculateTotalCosts } = usePoolSelectionData(pool.id);
  const costs = calculateTotalCosts();
  
  // Calculate RRP using margin formula: Cost / (1 - Margin/100)
  const calculateRRP = (cost: number, marginPercentage: number) => {
    if (marginPercentage >= 100) return 0; // Prevent division by zero or negative values
    return cost / (1 - marginPercentage / 100);
  };
  
  const marginPercentage = marginData || 0;
  const totalCost = costs?.total || 0;
  const rrp = calculateRRP(totalCost, marginPercentage);
  
  // Calculate the dollar margin amount (RRP - Total Cost)
  const dollarMargin = rrp - totalCost;
  
  return (
    <div className="space-y-4">
      <div className="bg-slate-50 rounded-lg p-4 border">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-3 rounded-md border space-y-1">
            <span className="text-sm text-muted-foreground">Margin Percentage</span>
            <div className="text-xl font-semibold">{marginPercentage.toFixed(2)}%</div>
            <div className="text-xs text-muted-foreground">
              Portion of selling price as profit
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-md border space-y-1">
            <span className="text-sm text-muted-foreground">Dollar Margin</span>
            <div className="text-xl font-semibold text-green-600">{formatCurrency(dollarMargin)}</div>
            <div className="text-xs text-muted-foreground">
              Actual profit amount
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-md border space-y-1">
            <span className="text-sm text-muted-foreground">Recommended Retail Price</span>
            <div className="text-xl font-semibold text-primary">{formatCurrency(rrp)}</div>
            <div className="text-xs text-muted-foreground">
              Cost / (1 - Margin/100)
            </div>
          </div>
        </div>
        
        <div className="mt-3 text-xs text-muted-foreground">
          <p>The RRP is calculated using the margin percentage from the Pool Worksheet. 
          This represents the recommended selling price to achieve the desired profit margin.</p>
        </div>
      </div>
    </div>
  );
};
