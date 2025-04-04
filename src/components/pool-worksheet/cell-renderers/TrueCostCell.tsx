
import { formatCurrency } from "@/utils/format";
import { useFixedCostsData } from "../hooks/useFixedCostsData";
import { useCraneData } from "../hooks/useCraneData";
import { usePoolDigData } from "../hooks/usePoolDigData";
import { calculatePackagePrice } from "@/utils/package-calculations";

interface TrueCostCellProps {
  poolId: string;
  poolCost: Record<string, number>;
  packageInfo: any;
  pool: any;
}

export const TrueCostCell = ({ poolId, poolCost, packageInfo, pool }: TrueCostCellProps) => {
  // Get fixed costs total (row 40)
  const { calculateFixedCostsTotal } = useFixedCostsData();
  const fixedCostsTotal = calculateFixedCostsTotal();
  
  // Get excavation cost (row 21)
  const { calculateExcavationCost } = usePoolDigData();
  const excavationCost = calculateExcavationCost(poolId);
  
  // Get crane cost (row 19)
  const { getCraneCost } = useCraneData();
  const craneCost = getCraneCost(poolId);
  
  // Get package price (row 17 - Filtration Package Price)
  // Use calculatePackagePrice to ensure we get the correct price
  const packagePrice = packageInfo ? calculatePackagePrice(packageInfo) : 0;
  
  // Get buy price (row 15 - Buy Price inc GST)
  const buyPriceIncGST = pool?.buy_price_inc_gst || 0;
  
  // Calculate construction costs total (row 29 - Pool Individual Costs Total)
  const constructionCostsTotal = 
    (poolCost.pea_gravel || 0) + 
    (poolCost.install_fee || 0) + 
    (poolCost.trucked_water || 0) + 
    (poolCost.salt_bags || 0) + 
    (poolCost.coping_supply || 0) + 
    (poolCost.beam || 0) + 
    (poolCost.coping_lay || 0);
  
  // Calculate the true cost by adding up all costs from the specified rows
  const trueCost = buyPriceIncGST + packagePrice + craneCost + excavationCost + constructionCostsTotal + fixedCostsTotal;
  
  // Log calculation details for debugging
  console.log(`True Cost Calculation for pool ${poolId}:`, {
    buyPriceIncGST,
    packagePrice,
    craneCost,
    excavationCost,
    constructionCostsTotal,
    fixedCostsTotal,
    totalTrueCost: trueCost
  });
  
  return <>{formatCurrency(trueCost)}</>;
};
