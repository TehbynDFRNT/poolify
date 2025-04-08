
import { TableBody as UITableBody, TableRow, TableCell } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { PoolTableRow } from "./PoolTableRow";

interface TableBodyProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  error: Error | null;
  getVisibleColumns: () => string[];
}

export const PoolTableBody = ({ pools, isLoading, error, getVisibleColumns }: TableBodyProps) => {
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
            Error loading pool specifications: {error.message}
          </TableCell>
        </TableRow>
      </UITableBody>
    );
  }
  
  if (!pools || pools.length === 0) {
    return (
      <UITableBody>
        <TableRow>
          <TableCell colSpan={getVisibleColumns().length} className="text-center py-8">
            <div className="flex flex-col items-center justify-center">
              <p className="text-lg font-medium text-muted-foreground mb-2">No pool data available</p>
              <p className="text-sm text-muted-foreground">The data has been reset. Please navigate to Pool Specifications 
                to add new pool data.</p>
            </div>
          </TableCell>
        </TableRow>
      </UITableBody>
    );
  }

  return (
    <UITableBody>
      {pools.map((pool) => (
        <PoolTableRow
          key={pool.id}
          pool={pool}
          getVisibleColumns={getVisibleColumns}
          packagesByPoolId={{}}
          poolCosts={new Map()}
        />
      ))}
    </UITableBody>
  );
};
