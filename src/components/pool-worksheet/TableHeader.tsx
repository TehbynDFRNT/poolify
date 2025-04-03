
import { TableHead, TableHeader as UITableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ColumnGroup, ColumnLabels } from "./types";
import { columnLabels } from "./column-config";

interface TableHeaderProps {
  visibleColumnGroups: ColumnGroup[];
  getVisibleColumns: () => string[];
}

export const TableHeader = ({ visibleColumnGroups, getVisibleColumns }: TableHeaderProps) => {
  console.log("Visible column groups:", visibleColumnGroups);
  console.log("Visible columns:", getVisibleColumns());
  
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
      
      {/* Render column headers */}
      <TableRow>
        {getVisibleColumns().map(column => {
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
