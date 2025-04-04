
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { columnGroups, essentialColumns } from "./PoolSpecificationsTable";

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
  
  // Order columns: first the dimension columns, then volume info, then pricing, then name, then range
  const orderedColumns = [
    ...columnGroups.flatMap(group => group.columns.filter(col => allColumns.includes(col))),
    ...essentialColumns
  ];

  // Remove duplicates while preserving order
  const displayColumns = [...new Set(orderedColumns)];

  return (
    <UITableHeader>
      <TableRow>
        {displayColumns.map((column) => {
          if (!isColumnVisible(column)) return null;
          
          // Format the column header
          const formattedHeader = column
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          return (
            <TableHead 
              key={column}
              className={column === "range" || column === "name" ? "" : ""}
            >
              {formattedHeader}
            </TableHead>
          );
        })}
      </TableRow>
    </UITableHeader>
  );
}
