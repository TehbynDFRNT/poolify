
import { TableBody as UITableBody, TableRow, TableCell } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { usePoolCostsData } from "./hooks/usePoolCostsData";
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { PoolTableRow } from "./PoolTableRow";

interface TableBodyProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  error: Error | null;
  getVisibleColumns: () => string[];
}

export const PoolTableBody = ({ pools, isLoading, error, getVisibleColumns }: TableBodyProps) => {
  const { poolsWithPackages } = usePoolPackages();
  const { poolCosts } = usePoolCostsData();

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
        <PoolTableRow
          key={pool.id}
          pool={pool}
          getVisibleColumns={getVisibleColumns}
          packagesByPoolId={packagesByPoolId}
          poolCosts={poolCosts || new Map()}
        />
      ))}
    </UITableBody>
  );
};
