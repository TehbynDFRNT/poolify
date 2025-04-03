import { TableBody as UITableBody, TableRow, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { Pool } from "@/types/pool";
import { usePoolCostsData } from "./hooks/usePoolCostsData";
import { usePoolDigData } from "./hooks/usePoolDigData";
import { useFixedCostsData } from "./hooks/useFixedCostsData";
import { useCraneData } from "./hooks/useCraneData";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { calculatePackagePrice } from "@/utils/package-calculations";

interface TableBodyProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  error: Error | null;
  getVisibleColumns: () => string[];
}

export const PoolTableBody = ({ pools, isLoading, error, getVisibleColumns }: TableBodyProps) => {
  const { poolsWithPackages } = usePoolPackages();
  const { poolCosts } = usePoolCostsData();
  const { calculateExcavationCost, getDigTypeName } = usePoolDigData();
  const { fixedCosts, calculateFixedCostsTotal } = useFixedCostsData();
  const { getCraneName, getCraneCost } = useCraneData();

  // Create a lookup object for packages by pool ID
  const packagesByPoolId = poolsWithPackages?.reduce((acc, pool) => {
    if (pool.default_filtration_package_id && pool.default_package) {
      acc[pool.id] = pool.default_package;
    }
    return acc;
  }, {} as Record<string, any>) || {};

  if (isLoading) {
    return (
      <UITableBody>
        <TableRow>
          <TableCell colSpan={getVisibleColumns().length} className="text-center py-4">
            Loading pool specifications...
          </TableCell>
        </TableRow>
      </UITableBody>
    );
  }
  
  if (error) {
    return (
      <UITableBody>
        <TableRow>
          <TableCell colSpan={getVisibleColumns().length} className="text-center py-4 text-red-500">
            Error loading pool specifications
          </TableCell>
        </TableRow>
      </UITableBody>
    );
  }
  
  if (!pools || pools.length === 0) {
    return (
      <UITableBody>
        <TableRow>
          <TableCell colSpan={getVisibleColumns().length} className="text-center py-4">
            No pool specifications available
          </TableCell>
        </TableRow>
      </UITableBody>
    );
  }

  return (
    <UITableBody>
      {pools.map((pool) => (
        <TableRow key={pool.id}>
          {getVisibleColumns().map(column => {
            // Handle crane columns
            if (column === "crane_type") {
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {getCraneName(pool.id)}
                </TableCell>
              );
            } else if (column === "crane_cost") {
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {formatCurrency(getCraneCost(pool.id))}
                </TableCell>
              );
            }
            
            // Handle excavation columns
            if (column === "dig_type") {
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {getDigTypeName(pool.id)}
                </TableCell>
              );
            } else if (column === "dig_total") {
              const digTotal = calculateExcavationCost(pool.id);
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {formatCurrency(digTotal)}
                </TableCell>
              );
            }

            // Handle fixed costs total column
            if (column === "fixed_costs_total") {
              const total = calculateFixedCostsTotal();
              return (
                <TableCell key={`${pool.id}-${column}`} className="font-medium">
                  {formatCurrency(total)}
                </TableCell>
              );
            }
            
            // Handle fixed cost columns
            if (column.startsWith('fixed_cost_') && fixedCosts) {
              const fixedCostId = column.replace('fixed_cost_', '');
              const fixedCost = fixedCosts.find(cost => cost.id === fixedCostId);
              
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {fixedCost ? formatCurrency(fixedCost.price) : '-'}
                </TableCell>
              );
            }
            
            // Handle filtration package columns
            if (column === "default_package") {
              const package_info = packagesByPoolId[pool.id];
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {package_info ? `Option ${package_info.display_order}` : '-'}
                </TableCell>
              );
            } else if (column === "package_price") {
              const package_info = packagesByPoolId[pool.id];
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {package_info ? formatCurrency(calculatePackagePrice(package_info)) : '-'}
                </TableCell>
              );
            }
            
            // Handle construction costs columns
            const poolCost = poolCosts?.get(pool.id) || {};
            
            if (column === "excavation") {
              const excavationCost = calculateExcavationCost(pool.id);
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {formatCurrency(excavationCost)}
                </TableCell>
              );
            } else if (column === "total_cost") {
              const excavationCost = calculateExcavationCost(pool.id);
              const total = 
                excavationCost + 
                (poolCost.pea_gravel || 0) + 
                (poolCost.install_fee || 0) + 
                (poolCost.trucked_water || 0) + 
                (poolCost.salt_bags || 0) + 
                (poolCost.coping_supply || 0) + 
                (poolCost.beam || 0) + 
                (poolCost.coping_lay || 0);
              
              return (
                <TableCell key={`${pool.id}-${column}`} className="font-medium">
                  {formatCurrency(total)}
                </TableCell>
              );
            } else if ([
              "pea_gravel", 
              "install_fee", 
              "trucked_water", 
              "salt_bags", 
              "coping_supply", 
              "beam", 
              "coping_lay"
            ].includes(column)) {
              return (
                <TableCell key={`${pool.id}-${column}`}>
                  {formatCurrency(poolCost[column] || 0)}
                </TableCell>
              );
            }
            
            // Handle regular pool specification columns
            const value = pool[column as keyof typeof pool];
            
            // Format the value based on column type
            let displayValue: string | number | null = value as string | number | null;
            
            if (column === "length" || column === "width" || 
                column === "depth_shallow" || column === "depth_deep" || 
                column === "waterline_l_m") {
              if (typeof value === 'number') {
                displayValue = `${value.toFixed(2)}m`;
              }
            } else if (column === "volume_liters") {
              if (typeof value === 'number') {
                displayValue = `${value.toLocaleString()}L`;
              }
            } else if (column === "weight_kg") {
              if (typeof value === 'number') {
                displayValue = `${value.toLocaleString()}kg`;
              }
            } else if (column === "buy_price_ex_gst" || column === "buy_price_inc_gst") {
              if (typeof value === 'number') {
                displayValue = formatCurrency(value);
              }
            }
            
            return (
              <TableCell key={`${pool.id}-${column}`}>
                {displayValue || '-'}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </UITableBody>
  );
};
