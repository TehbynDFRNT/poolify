
import { TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { columnLabels } from "../constants";

interface PoolsTableHeaderProps {
  visibleColumnGroups: { 
    id: string;
    title: string;
    color: string;
    columns: string[];
  }[];
  getVisibleColumns: () => string[];
}

export const PoolsTableHeader = ({ visibleColumnGroups, getVisibleColumns }: PoolsTableHeaderProps) => {
  return (
    <TableHeader>
      {/* Render group headers */}
      <TableRow>
        {visibleColumnGroups.map(group => (
          <TableCell 
            key={`header-${group.id}`} 
            colSpan={group.columns.length} 
            className={`${group.color} font-medium py-2 px-4 text-left border-b border-r`}
          >
            {group.title}
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
            <TableHead key={column}>
              {headerLabel}
            </TableHead>
          );
        })}
      </TableRow>
    </TableHeader>
  );
};
