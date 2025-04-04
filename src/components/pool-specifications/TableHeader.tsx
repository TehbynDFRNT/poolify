
import { TableHead, TableHeader as UITableHeader, TableRow } from "@/components/ui/table";
import { Pool } from "@/types/pool";
import { criticalColumns, toggleableColumnGroups } from "./ColumnConfigSheet";

interface TableHeaderProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  isColumnVisible: (columnName: string) => boolean;
}

// Helper function to get all columns from all groups
const getAllPossibleColumns = () => {
  return [
    ...criticalColumns,
    ...toggleableColumnGroups.flatMap(group => group.columns)
  ];
};

export function TableHeader({ pools, isLoading, isColumnVisible }: TableHeaderProps) {
  if (isLoading || !pools || pools.length === 0) return null;

  // Get all column keys from the first pool object
  const allPoolColumns = Object.keys(pools[0]).filter(key => 
    key !== 'id' && 
    !key.startsWith('_') && 
    key !== 'created_at' && 
    key !== 'updated_at'
  );
  
  // Add any additional columns we need (like calculated columns)
  const additionalColumns = ['package_price', 'crane_cost', 'dig_total', 'total_cost', 'fixed_costs_total', 'true_cost'];
  
  // Combine all possible columns
  const allColumns = [...new Set([...allPoolColumns, ...additionalColumns])];
  
  // Filter visible columns and ensure critical columns come first, followed by the rest
  const visibleColumns = allColumns.filter(col => isColumnVisible(col));
  
  // Order columns properly: first critical columns in their defined order, then the rest
  const orderedVisibleColumns = [
    ...criticalColumns.filter(col => visibleColumns.includes(col)),
    ...visibleColumns.filter(col => !criticalColumns.includes(col))
  ];

  return (
    <UITableHeader>
      <TableRow>
        {orderedVisibleColumns.map((column, index) => {
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
