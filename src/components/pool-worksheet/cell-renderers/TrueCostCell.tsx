
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
  const { craneDataByPoolId } = useCraneData();
  const { digDataByPoolId } = usePoolDigData();
  
  // Calculate the true cost of the pool
  const getTrueCost = () => {
    // Get fixed costs total
    const fixedCostsTotal = fixedCosts?.fixed_costs_total || 0;
    
    // Get construction costs total
    const constructionCostsTotal = 
      (poolCost?.pea_gravel || 0) + 
      (poolCost?.install_fee || 0) + 
      (poolCost?.trucked_water || 0) + 
      (poolCost?.salt_bags || 0) + 
      (poolCost?.coping_supply || 0) + 
      (poolCost?.beam || 0) + 
      (poolCost?.coping_lay || 0);
    
    // Get filtration package cost
    const filtrationCost = packageInfo?.price || 0;
    
    // Get crane cost
    const craneCost = craneDataByPoolId?.[poolId]?.crane_cost || 0;
    
    // Get excavation cost
    const excavationCost = digDataByPoolId?.[poolId]?.dig_total || 0;
    
    // Calculate total true cost
    const trueCost = 
      fixedCostsTotal + 
      constructionCostsTotal + 
      filtrationCost + 
      craneCost + 
      excavationCost + 
      (pool?.buy_price_ex_gst || 0);
      
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
