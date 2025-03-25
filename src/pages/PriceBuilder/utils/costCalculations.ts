
import { calculateGrandTotal } from "@/utils/digTypeCalculations";
import { calculatePackagePrice } from "@/utils/package-calculations";

export const calculateCosts = (
  pool: any,
  margin: number,
  fixedCosts: any[] | undefined,
  poolCosts: Map<any, any> | undefined,
  excavationDetails: Map<any, any> | undefined,
  craneSelection?: Map<string, any> | undefined
) => {
  const basePrice = pool.buy_price_inc_gst || 0;
  const filtrationCost = pool.default_filtration_package ? calculatePackagePrice(pool.default_filtration_package) : 0;
  const fixedCostsTotal = fixedCosts?.reduce((sum, cost) => sum + cost.price, 0) || 0;
  
  const individualCosts = poolCosts?.get(pool.id);
  const individualCostsTotal = individualCosts ? Object.entries(individualCosts).reduce((sum, [key, value]) => {
    if (key !== 'id' && key !== 'pool_id' && key !== 'created_at' && key !== 'updated_at' && typeof value === 'number') {
      return sum + value;
    }
    return sum;
  }, 0) : 0;
  
  const excavationCost = excavationDetails?.get(pool.id) ? calculateGrandTotal(excavationDetails.get(pool.id)) : 0;
  
  // Consistent handling of crane cost
  let craneCost = 0;
  if (craneSelection?.get(pool.id)?.price) {
    craneCost = Number(craneSelection.get(pool.id).price);
  }
  
  const totalCost = basePrice + filtrationCost + fixedCostsTotal + individualCostsTotal + excavationCost + craneCost;
  
  // Convert margin to RRP
  // If we want a margin of M%, then:
  // M = (RRP - Cost) / RRP * 100
  // Solving for RRP:
  // M/100 = (RRP - Cost) / RRP
  // M*RRP/100 = RRP - Cost
  // RRP - M*RRP/100 = Cost
  // RRP*(1 - M/100) = Cost
  // RRP = Cost / (1 - M/100)
  const rrp = margin >= 100 ? 0 : totalCost / (1 - margin / 100);

  return {
    basePrice,
    filtrationCost,
    fixedCostsTotal,
    individualCostsTotal,
    excavationCost,
    craneCost,
    total: totalCost,
    rrp
  };
};
