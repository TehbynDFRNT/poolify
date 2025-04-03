
import { TableHead, TableHeader as UITableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ColumnGroup, ColumnLabels } from "./types";
import { columnLabels, columnGroups as allColumnGroups } from "./column-config";

interface TableHeaderProps {
  visibleColumnGroups: ColumnGroup[];
  getVisibleColumns: () => string[];
}

// Create a mapping of column keys to their fixed column numbers
const getColumnNumberMap = () => {
  // Flatten all columns from all groups to create a full column list
  const allColumns = allColumnGroups.flatMap(group => group.columns);
  
  // Create a map of column keys to their fixed position
  const columnNumberMap: Record<string, number> = {};
  
  // Assign a fixed number to each column
  allColumns.forEach((column, index) => {
    columnNumberMap[column] = index + 1;
  });
  
  return columnNumberMap;
};

const columnNumberMap = getColumnNumberMap();

export const TableHeader = ({ visibleColumnGroups, getVisibleColumns }: TableHeaderProps) => {
  console.log("Visible column groups:", visibleColumnGroups);
  console.log("Visible columns:", getVisibleColumns());
  
  // Get all visible columns
  const visibleColumns = getVisibleColumns();
  
  return (
    <UITableHeader>
      {/* Render group headers */}
      <TableRow>
        {visibleColumnGroups.map(group => (
          <TableCell 
            key={`header-${group.id}`} 
            colSpan={group.columns.length} 
            className={`${group.color} font-medium py-2 px-4 text-left border-b border-r`}
          >
            {group.title} ({group.columns.length})
          </TableCell>
        ))}
      </TableRow>
      
      {/* Add a dedicated row for fixed column numbers */}
      <TableRow>
        {visibleColumns.map((column) => {
          // Every column should have a numbered circle, including fixed costs columns
          const columnNumber = columnNumberMap[column] || '-';
          
          return (
            <TableHead key={`number-${column}`} className="py-1 border-b">
              <div className="w-6 h-6 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {columnNumber}
              </div>
            </TableHead>
          );
        })}
      </TableRow>
      
      {/* Render column headers */}
      <TableRow>
        {visibleColumns.map((column) => {
          // For fixed cost columns, use the name from columnLabels
          const headerLabel = column.startsWith('fixed_cost_')
            ? columnLabels[column]
            : columnLabels[column] || column;
          
          return (
            <TableHead 
              key={column} 
              className={column === "dig_type" ? "whitespace-nowrap w-32" : ""}
            >
              {headerLabel}
            </TableHead>
          );
        })}
      </TableRow>
    </UITableHeader>
  );
};
