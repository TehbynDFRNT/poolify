
import { Pool } from "@/types/pool";
import { CraneCell } from "./CraneCell";
import { ExcavationCell } from "./ExcavationCell";
import { FixedCostsCell } from "./FixedCostsCell";
import { FiltrationPackageCell } from "./FiltrationPackageCell";
import { ConstructionCostsCell } from "./ConstructionCostsCell";
import { PoolSpecificationCell } from "./PoolSpecificationCell";
import { TrueCostCell } from "./TrueCostCell";

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
  if (column === "dig_type" || column === "dig_total") {
    return <ExcavationCell poolId={pool.id} column={column} />;
  }

  // Handle fixed costs columns
  if (column === "fixed_costs_total" || column.startsWith('fixed_cost_')) {
    return <FixedCostsCell column={column} />;
  }
  
  // Handle filtration package columns
  if (column === "default_package" || column === "package_price") {
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
    return <TrueCostCell 
      poolId={pool.id}
      poolCost={poolCost}
      packageInfo={packageInfo}
      pool={pool}
    />;
  }
  
  // Handle regular pool specification columns
  return <PoolSpecificationCell pool={pool} column={column} />;
};
