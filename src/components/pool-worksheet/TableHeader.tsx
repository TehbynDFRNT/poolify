
import { TableHead, TableHeader as UITableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ColumnGroup } from "./types";
import { columnLabels } from "./column-config";

interface TableHeaderProps {
  visibleColumnGroups: ColumnGroup[];
  getVisibleColumns: () => string[];
  showEssentialOnly?: boolean;
}

export const TableHeader = ({ 
  visibleColumnGroups, 
  getVisibleColumns,
  showEssentialOnly = false
}: TableHeaderProps) => {
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
      
      {/* Render column headers */}
      <TableRow>
        {visibleColumns.map((column) => {
          const headerLabel = columnLabels[column] || column;
          
          return (
            <TableHead key={column}>
              {headerLabel}
            </TableHead>
          );
        })}
      </TableRow>
    </UITableHeader>
  );
};
