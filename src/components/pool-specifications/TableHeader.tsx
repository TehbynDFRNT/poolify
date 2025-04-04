
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { criticalColumns } from "./ColumnConfigSheet";

interface TableHeaderProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  isColumnVisible: (columnName: string) => boolean;
}

export function TableHeader({ pools, isLoading, isColumnVisible }: TableHeaderProps) {
  if (isLoading || !pools || pools.length === 0) return null;

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

  // Filter to only visible columns
  const visibleColumns = orderedColumns.filter(col => isColumnVisible(col));

  return (
    <UITableHeader>
      <TableRow>
        {visibleColumns.map((column, index) => {
          // Format the column header
          const formattedHeader = column
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return (
            <TableHead 
              key={column}
              className="relative"
            >
              <div className="flex flex-col">
                {/* Column number */}
                <div className="w-6 h-6 mb-1 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold mx-auto">
                  {index + 1}
                </div>
                {/* Column name */}
                <span>{formattedHeader}</span>
              </div>
            </TableHead>
          );
        })}
      </TableRow>
    </UITableHeader>
  );
}
