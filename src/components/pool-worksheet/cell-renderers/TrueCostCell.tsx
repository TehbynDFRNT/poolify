
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
  
  // Calculate the true cost of the pool according to the formula: 15+17+19+21+29+40
  // Which corresponds to: buy_price_inc_gst + package_price + crane_cost + dig_total + total_cost + fixed_costs_total
  const getTrueCost = () => {
    // Display a placeholder when data is missing
    if (!pool || !poolId) {
      console.log('No pool data available for True Cost calculation');
      return 0;
    }
    
    console.log(`========= True Cost Calculation for pool ${pool.name} (${poolId}) =========`);
    console.log('Following the formula: Column 15 + Column 17 + Column 19 + Column 21 + Column 29 + Column 40');
    
    // Column 15: Buy Price (inc GST)
    const poolBuyPrice = pool?.buy_price_inc_gst || 0;
    console.log('Column 15 - Pool buy price (inc GST):', poolBuyPrice);
    
    // Column 17: Filtration Package Price
    const filtrationCost = packageInfo?.price || 0;
    console.log('Column 17 - Filtration package cost:', filtrationCost);
    
    // Column 19: Crane Cost
    const craneCost = getCraneCost(poolId);
    console.log('Column 19 - Crane cost:', craneCost);
    
    // Column 21: Excavation Cost
    const excavationCost = calculateExcavationCost(poolId);
    console.log('Column 21 - Excavation cost:', excavationCost);
    
    // Column 29: Construction Costs Total
    const constructionCosts = {
      pea_gravel: poolCost?.pea_gravel || 0,
      install_fee: poolCost?.install_fee || 0,
      trucked_water: poolCost?.trucked_water || 0,
      salt_bags: poolCost?.salt_bags || 0,
      coping_supply: poolCost?.coping_supply || 0,
      beam: poolCost?.beam || 0,
      coping_lay: poolCost?.coping_lay || 0
    };
    
    const constructionCostsTotal = 
      constructionCosts.pea_gravel + 
      constructionCosts.install_fee + 
      constructionCosts.trucked_water + 
      constructionCosts.salt_bags + 
      constructionCosts.coping_supply + 
      constructionCosts.beam + 
      constructionCosts.coping_lay;
      
    // Log individual construction costs for debugging
    console.log('Column 29 - Construction costs:', {
      ...constructionCosts,
      total: constructionCostsTotal
    });
    
    // Column 40: Fixed Costs Total
    const fixedCostsTotal = fixedCosts ? 
      fixedCosts.reduce((total, cost) => total + (cost.price || 0), 0) : 0;
    console.log('Column 40 - Fixed costs total:', fixedCostsTotal);
    
    // Calculate total true cost according to the formula
    const trueCost = 
      poolBuyPrice +
      filtrationCost + 
      craneCost + 
      excavationCost + 
      constructionCostsTotal + 
      fixedCostsTotal;
    
    console.log('TOTAL TRUE COST (sum of columns 15+17+19+21+29+40):', trueCost);
    console.log(`=================================================================`);
      
    return trueCost;
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
