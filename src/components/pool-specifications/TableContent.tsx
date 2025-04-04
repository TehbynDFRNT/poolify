
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { criticalColumns } from "./ColumnConfigSheet";

interface TableContentProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  error: Error | null;
  isColumnVisible: (columnName: string) => boolean;
}

export function TableContent({ pools, isLoading, error, isColumnVisible }: TableContentProps) {
  if (isLoading) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={999} className="text-center py-6">
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
          <TableCell colSpan={999} className="text-center py-6 text-red-500">
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
          <TableCell colSpan={999} className="text-center py-16">
            <p className="text-muted-foreground">No pool specifications available</p>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }

  // Get all column keys from the first pool object
  const allColumns = Object.keys(pools[0]).filter(key => 
    key !== 'id' && 
    !key.startsWith('_') && 
    key !== 'created_at' && 
    key !== 'updated_at'
  );
  
  // Order columns properly: first critical columns in their defined order, then the rest
  const orderedColumns = [
    ...criticalColumns.filter(col => allColumns.includes(col)),
    ...allColumns.filter(col => !criticalColumns.includes(col))
  ];

  return (
    <TableBody>
      {pools.map((pool) => (
        <TableRow key={pool.id}>
          {orderedColumns.map((column) => {
            if (!isColumnVisible(column)) return null;
            
            const value = pool[column as keyof Pool];
            let displayValue = value;
            
            // Format numeric values with thousands separator
            if (typeof value === 'number') {
              if (column.includes('price') || column.includes('cost')) {
                // Currency formatting
                displayValue = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
              } else {
                // Regular number formatting
                displayValue = value.toLocaleString();
              }
            }
            
            return (
              <TableCell 
                key={`${pool.id}-${column}`}
                className={column === "range" || column === "name" ? "font-medium" : ""}
              >
                {displayValue || '-'}
              </TableCell>
            );
          })}
        </TableRow>
      ))}
    </TableBody>
  );
}
