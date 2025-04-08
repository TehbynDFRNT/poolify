
import { formatCurrency } from "@/utils/format";
import { Pool } from "@/types/pool";
import { useFixedCostsData } from "@/components/pool-worksheet/hooks/useFixedCostsData";
import { useCraneData } from "@/components/pool-worksheet/hooks/useCraneData";
import { usePoolDigData } from "@/components/pool-worksheet/hooks/usePoolDigData";

interface TrueCostCellProps {
  poolId: string;
  poolCost: Record<string, number>;
  packageInfo: any;
  pool: Pool;
}

export const TrueCostCell = ({ poolId, poolCost, packageInfo, pool }: TrueCostCellProps) => {
  const { fixedCosts } = useFixedCostsData();
  const { getCraneCost } = useCraneData();
  const { calculateExcavationCost } = usePoolDigData();
  
  // Calculate the true cost of the pool by summing the six specified columns
  const getTrueCost = () => {
    // Display a placeholder when data is missing
    if (!pool || !poolId) {
      console.log('No pool data available for True Cost calculation');
      return 0;
    }
    
    console.log(`========= True Cost Calculation for pool ${pool.name} (${poolId}) =========`);
    
    // 1. Buy Price (inc GST)
    const poolBuyPrice = pool?.buy_price_inc_gst || 0;
    console.log('Buy Price (inc GST):', poolBuyPrice);
    
    // 2. Fixed Costs Total
    const fixedCostsTotal = fixedCosts ? 
      fixedCosts.reduce((total, cost) => total + (cost.price || 0), 0) : 0;
    console.log('Fixed Costs Total:', fixedCostsTotal);
    
    // 3. Filtration Costs
    const filtrationCost = calculateFiltrationCost(packageInfo);
    console.log('Filtration Costs:', filtrationCost);
    
    // 4. Crane Cost
    const craneCost = getCraneCost(poolId);
    console.log('Crane Cost:', craneCost);
    
    // 5. Excavation Cost
    const excavationCost = calculateExcavationCost(poolId);
    console.log('Excavation Cost:', excavationCost);
    
    // 6. Individual Costs
    const individualCosts = calculateIndividualCosts(poolCost);
    console.log('Individual Costs:', individualCosts);
    
    // Sum all six costs
    const trueCost = 
      poolBuyPrice +
      fixedCostsTotal + 
      filtrationCost + 
      craneCost + 
      excavationCost + 
      individualCosts;
    
    console.log('TOTAL TRUE COST (sum of all six columns):', trueCost);
    console.log(`=================================================================`);
      
    return trueCost;
  };
  
  // Calculate filtration cost from package info
  const calculateFiltrationCost = (packageInfo: any): number => {
    if (!packageInfo) return 0;
    
    let totalCost = 0;
    
    // Add costs for main components if they exist
    if (packageInfo.pump?.price) totalCost += packageInfo.pump.price;
    if (packageInfo.filter?.price) totalCost += packageInfo.filter.price;
    if (packageInfo.sanitiser?.price) totalCost += packageInfo.sanitiser.price;
    if (packageInfo.light?.price) totalCost += packageInfo.light.price;
    
    // Add costs for handover kit components if they exist
    if (packageInfo.handover_kit?.components) {
      packageInfo.handover_kit.components.forEach((item: any) => {
        if (item.component?.price && item.quantity) {
          totalCost += item.component.price * item.quantity;
        }
      });
    }
    
    return totalCost;
  };
  
  // Calculate individual costs total
  const calculateIndividualCosts = (poolCost: Record<string, number>) => {
    if (!poolCost) return 0;
    
    const total = 
      (poolCost.pea_gravel || 0) + 
      (poolCost.install_fee || 0) + 
      (poolCost.trucked_water || 0) + 
      (poolCost.salt_bags || 0) + 
      (poolCost.coping_supply || 0) + 
      (poolCost.beam || 0) + 
      (poolCost.coping_lay || 0);
    
    return total;
  };
  
  const trueCost = getTrueCost();
  const formattedTrueCost = formatCurrency(trueCost);
  
  // Return not just the formatted string, but also the calculation function
  // so it can be reused by other components
  return {
    getTrueCost,
    content: <>{formattedTrueCost}</>
  };
};
