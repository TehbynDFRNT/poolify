
import { formatCurrency } from "@/utils/format";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { calculatePackagePrice } from "@/pages/PoolWorksheet/utils/calculationHelpers";

interface PoolsTableBodyProps {
  pools: Pool[];
  isLoading: boolean;
  error: Error | null;
  getVisibleColumns: () => string[];
  calculateExcavationCost: (poolId: string) => number;
  fixedCosts: any[] | undefined;
  poolCosts: Map<string, any> | undefined;
  packagesByPoolId: Record<string, any>;
  fixedCostsTotal: number;
  visibleGroups: string[];
  poolDigMatches: Map<string, any> | undefined;
}

export const PoolsTableBody = ({ 
  pools, 
  isLoading, 
  error, 
  getVisibleColumns,
  calculateExcavationCost,
  fixedCosts,
  poolCosts,
  packagesByPoolId,
  fixedCostsTotal,
  visibleGroups,
  poolDigMatches
}: PoolsTableBodyProps) => {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={getVisibleColumns().length} className="text-center py-4">
            Loading pool specifications...
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (error) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={getVisibleColumns().length} className="text-center py-4 text-red-500">
            Error loading pool specifications
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  if (!pools || pools.length === 0) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={getVisibleColumns().length} className="text-center py-4">
            No pool specifications available
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  return (
    <TableBody>
      {/* Regular pool rows */}
      {pools.map((pool) => (
        <TableRow key={pool.id}>
          {getVisibleColumns().map(column => {
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
      
      {/* Only show one fixed costs total row when fixed costs group is visible */}
      {visibleGroups.includes('fixed_costs') && (
        <TableRow className="bg-purple-100 font-bold">
          {getVisibleColumns().map((column, columnIndex) => {
            // First column shows "FIXED COSTS TOTAL"
            if (columnIndex === 0) {
              return (
                <TableCell key="fixed-costs-total-label" className="font-bold">
                  FIXED COSTS TOTAL
                </TableCell>
              );
            }
            
            // Show each fixed cost value in its respective column
            if (column.startsWith('fixed_cost_') && fixedCosts) {
              const fixedCostId = column.replace('fixed_cost_', '');
              const fixedCost = fixedCosts.find(cost => cost.id === fixedCostId);
              
              return (
                <TableCell key={`fixed-costs-total-${column}`} className="font-bold">
                  {fixedCost ? formatCurrency(fixedCost.price) : '-'}
                </TableCell>
              );
            }
            
            // Show grand total in the last fixed costs column
            const fixedCostsColumns = getVisibleColumns().filter(col => col.startsWith('fixed_cost_'));
            const isLastFixedCostColumn = column === fixedCostsColumns[fixedCostsColumns.length - 1];
            
            if (isLastFixedCostColumn) {
              return (
                <TableCell key="grand-total-value" className="font-bold">
                  {formatCurrency(fixedCostsTotal)}
                </TableCell>
              );
            }
            
            // Empty cells for other columns
            return <TableCell key={`fixed-costs-total-${column}`}></TableCell>;
          })}
        </TableRow>
      )}
    </TableBody>
  );
};
