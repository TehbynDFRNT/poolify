
import { calculatePackagePrice } from "@/utils/package-calculations";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { useState } from "react";

export interface CostsData {
  basePrice: number;
  filtrationCost: number;
  fixedCostsTotal: number;
  individualCostsTotal: number;
  excavationCost: number;
  total: number;
  marginPercentage: number;
  rrp: number;
  actualMargin: number;
}

export const usePricingCalculator = () => {
  const [totalCosts, setTotalCosts] = useState<CostsData | null>(null);

  const calculateTotalCosts = (
    selectedPool: any,
    filtrationPackage: any,
    fixedCosts: any[],
    poolCosts: any,
    excavationDetails: any,
    marginData: number
  ): CostsData | null => {
    if (!selectedPool) return null;
    
    const basePrice = selectedPool.buy_price_inc_gst || 0;
    const filtrationCost = filtrationPackage ? calculatePackagePrice(filtrationPackage) : 0;
    const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
    
    // Individual costs
    const individualCostsTotal = poolCosts ? Object.entries(poolCosts).reduce((sum, [key, value]) => {
      if (key !== 'id' && key !== 'pool_id' && key !== 'created_at' && key !== 'updated_at' && typeof value === 'number') {
        return sum + value;
      }
      return sum;
    }, 0) : 0;
    
    // Excavation cost
    const excavationCost = excavationDetails ? calculateGrandTotal(excavationDetails) : 0;
    
    // Calculate the grand total
    const total = basePrice + filtrationCost + fixedCostsTotal + individualCostsTotal + excavationCost;
    
    // Calculate margin, RRP and actual margin
    const marginPercentage = marginData || 0;
    const rrp = marginPercentage >= 100 ? 0 : total / (1 - marginPercentage / 100);
    const actualMargin = rrp - total;
    
    const calculatedCosts = {
      basePrice,
      filtrationCost,
      fixedCostsTotal,
      individualCostsTotal,
      excavationCost,
      total,
      marginPercentage,
      rrp,
      actualMargin
    };
    
    setTotalCosts(calculatedCosts);
    return calculatedCosts;
  };

  return {
    totalCosts,
    calculateTotalCosts
  };
};
