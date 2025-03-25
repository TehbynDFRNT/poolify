
import { calculatePackagePrice } from "@/utils/package-calculations";
import { PackageWithComponents } from "@/types/filtration";
import { DigType } from "@/types/dig-type";
import { CraneCost } from "@/types/crane-cost";
import { FixedCost } from "@/types/fixed-cost";
import { calculateGrandTotal } from "@/utils/digTypeCalculations";

interface CostInputs {
  basePrice: number;
  filtrationPackage: PackageWithComponents | null;
  fixedCosts: FixedCost[] | null;
  poolCosts: any | null;
  excavationDetails: DigType | null;
  selectedCrane: CraneCost | null;
  marginData: number;
}

export const useCostCalculation = () => {
  const calculateTotalCosts = (inputs: CostInputs) => {
    const {
      basePrice,
      filtrationPackage,
      fixedCosts,
      poolCosts,
      excavationDetails,
      selectedCrane,
      marginData
    } = inputs;
    
    // Calculate filtration cost
    const filtrationCost = filtrationPackage ? calculatePackagePrice(filtrationPackage) : 0;
    
    // Calculate fixed costs total
    const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
    
    // Calculate individual costs total
    const individualCostsTotal = poolCosts ? Object.entries(poolCosts).reduce((sum, [key, value]) => {
      if (key !== 'id' && key !== 'pool_id' && key !== 'created_at' && key !== 'updated_at' && typeof value === 'number') {
        return sum + value;
      }
      return sum;
    }, 0) : 0;
    
    // Calculate excavation cost
    const excavationCost = excavationDetails ? calculateGrandTotal(excavationDetails) : 0;
    
    // Calculate crane cost - ensure we convert to number
    const craneCost = selectedCrane ? Number(selectedCrane.price) || 0 : 0;
    
    // Calculate the grand total
    const total = basePrice + filtrationCost + fixedCostsTotal + individualCostsTotal + excavationCost + craneCost;
    
    // Calculate margin, RRP and actual margin
    const marginPercentage = marginData || 0;
    const rrp = marginPercentage >= 100 ? 0 : total / (1 - marginPercentage / 100);
    const actualMargin = rrp - total;
    
    return {
      basePrice,
      filtrationCost,
      fixedCostsTotal,
      individualCostsTotal,
      excavationCost,
      craneCost,
      total,
      marginPercentage,
      rrp,
      actualMargin
    };
  };

  return { calculateTotalCosts };
};
