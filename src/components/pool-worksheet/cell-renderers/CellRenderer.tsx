
import { Pool } from "@/types/pool";
import { CraneCell } from "./CraneCell";
import { ExcavationCell } from "./ExcavationCell";
import { FixedCostsCell } from "./FixedCostsCell";
import { FiltrationPackageCell } from "./FiltrationPackageCell";
import { ConstructionCostsCell } from "./ConstructionCostsCell";
import { PoolSpecificationCell } from "./PoolSpecificationCell";
import { TrueCostCell } from "./TrueCostCell";
import { MarginCell } from "./MarginCell";
import { WebPriceCell } from "./WebPriceCell";
import { useMargin } from "@/pages/Quotes/components/SelectPoolStep/hooks/useMargin";

interface CellRendererProps {
  pool: Pool;
  column: string;
  poolCost: Record<string, number>;
  packageInfo: any;
}

export const CellRenderer = ({ pool, column, poolCost, packageInfo }: CellRendererProps) => {
  // Handle crane columns
  if (column === "crane_type" || column === "crane_cost") {
    return <CraneCell poolId={pool.id} column={column} />;
  }
  
  // Handle excavation columns
  if (column === "dig_type" || column === "dig_total" || column === "excavation") {
    return <ExcavationCell poolId={pool.id} column={column} />;
  }

  // Handle fixed costs columns
  if (column === "fixed_costs_total" || column.startsWith('fixed_cost_')) {
    return <FixedCostsCell column={column} />;
  }
  
  // Handle filtration package column - only show filtration_costs now
  if (column === "filtration_costs") {
    return <FiltrationPackageCell package_info={packageInfo} column={column} />;
  }
  
  // Handle construction costs columns
  if (["total_cost", "pea_gravel", "install_fee", "trucked_water", 
       "salt_bags", "coping_supply", "beam", "coping_lay"].includes(column)) {
    return <ConstructionCostsCell 
      poolId={pool.id} 
      column={column} 
      poolCost={poolCost} 
    />;
  }

  // Handle True Cost column
  if (column === "true_cost") {
    const trueCostResult = TrueCostCell({ 
      poolId: pool.id,
      poolCost,
      packageInfo,
      pool
    });
    return trueCostResult.content;
  }
  
  // Handle Margin column
  if (column === "margin_percentage") {
    return <MarginCell poolId={pool.id} />;
  }
  
  // Handle Web Price column
  if (column === "web_price") {
    const { marginData } = useMargin(pool.id);
    const { getTrueCost } = TrueCostCell({ 
      poolId: pool.id, 
      poolCost, 
      packageInfo, 
      pool 
    });
    
    return <WebPriceCell 
      poolId={pool.id} 
      trueCost={getTrueCost()} 
      marginPercentage={marginData || 0} 
    />;
  }
  
  // Handle regular pool specification columns
  return <PoolSpecificationCell pool={pool} column={column} />;
};
