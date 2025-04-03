
import { TableRow, TableCell } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { CellRenderer } from "./cell-renderers/CellRenderer";

interface PoolTableRowProps {
  pool: Pool;
  getVisibleColumns: () => string[];
  packagesByPoolId: Record<string, any>;
  poolCosts: Map<string, any>;
}

export const PoolTableRow = ({ 
  pool, 
  getVisibleColumns, 
  packagesByPoolId, 
  poolCosts 
}: PoolTableRowProps) => {
  const columns = getVisibleColumns();
  const poolCost = poolCosts?.get(pool.id) || {};
  const packageInfo = packagesByPoolId[pool.id];
  
  return (
    <TableRow key={pool.id}>
      {columns.map((column, index) => (
        <TableCell key={`${pool.id}-${column}`}>
          <CellRenderer 
            pool={pool} 
            column={column} 
            poolCost={poolCost} 
            packageInfo={packageInfo}
          />
        </TableCell>
      ))}
    </TableRow>
  );
};
