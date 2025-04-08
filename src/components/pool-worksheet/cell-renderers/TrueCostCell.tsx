
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
  
  // Calculate the true cost of the pool
  const getTrueCost = () => {
    console.log(`========= True Cost Calculation for pool ${pool.name} (${poolId}) =========`);
    
    // Get fixed costs total
    const fixedCostsTotal = fixedCosts ? 
      fixedCosts.reduce((total, cost) => total + (cost.price || 0), 0) : 0;
    console.log('Fixed costs total:', fixedCostsTotal);
    
    // Get construction costs total
    const constructionCostsTotal = 
      (poolCost?.pea_gravel || 0) + 
      (poolCost?.install_fee || 0) + 
      (poolCost?.trucked_water || 0) + 
      (poolCost?.salt_bags || 0) + 
      (poolCost?.coping_supply || 0) + 
      (poolCost?.beam || 0) + 
      (poolCost?.coping_lay || 0);
      
    // Log individual construction costs for debugging
    console.log('Construction costs:', {
      pea_gravel: poolCost?.pea_gravel || 0,
      install_fee: poolCost?.install_fee || 0,
      trucked_water: poolCost?.trucked_water || 0,
      salt_bags: poolCost?.salt_bags || 0,
      coping_supply: poolCost?.coping_supply || 0,
      beam: poolCost?.beam || 0,
      coping_lay: poolCost?.coping_lay || 0,
      total: constructionCostsTotal
    });
    
    // Get filtration package cost
    const filtrationCost = packageInfo?.price || 0;
    console.log('Filtration package cost:', filtrationCost);
    
    // Get crane cost using the getCraneCost function
    const craneCost = getCraneCost(poolId);
    console.log('Crane cost:', craneCost);
    
    // Get excavation cost using the calculateExcavationCost function
    const excavationCost = calculateExcavationCost(poolId);
    console.log('Excavation cost:', excavationCost);
    
    // Get pool buy price
    const poolBuyPrice = pool?.buy_price_ex_gst || 0;
    console.log('Pool buy price:', poolBuyPrice);
    
    // Calculate total true cost
    const trueCost = 
      fixedCostsTotal + 
      constructionCostsTotal + 
      filtrationCost + 
      craneCost + 
      excavationCost + 
      poolBuyPrice;
    
    console.log('TOTAL TRUE COST:', trueCost);
    
    // Log the sum that user mentioned for comparison
    if (pool.name.includes('Empire')) {
      const userMentionedSum = 36859.8;
      console.log('User mentioned sum:', userMentionedSum);
      console.log('Difference:', userMentionedSum - trueCost);
      
      // Calculate if any component is missing by comparing
      const potentialMissingValue = userMentionedSum - trueCost;
      console.log('Potential missing value:', potentialMissingValue);
    }
    
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
