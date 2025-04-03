
import { TableHead, TableHeader as UITableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ColumnGroup, ColumnLabels } from "./types";
import { columnLabels, columnGroups as allColumnGroups } from "./column-config";
import { useState, useEffect } from "react";

interface TableHeaderProps {
  visibleColumnGroups: ColumnGroup[];
  getVisibleColumns: () => string[];
}

// Create a mapping of column keys to their fixed column numbers
const getColumnNumberMap = (columns: string[]) => {
  // Create a map of column keys to their fixed position
  const columnNumberMap: Record<string, number> = {};
  
  // Assign a fixed number to each column - 1-based index
  columns.forEach((column, index) => {
    columnNumberMap[column] = index + 1;
  });
  
  return columnNumberMap;
};

export const TableHeader = ({ visibleColumnGroups, getVisibleColumns }: TableHeaderProps) => {
  // Get all visible columns
  const visibleColumns = getVisibleColumns();
  
  // Store column number map in state to ensure it updates
  const [columnNumberMap, setColumnNumberMap] = useState<Record<string, number>>({});
  
  // Update column number map when columns change or fixed cost update event fires
  useEffect(() => {
    // Calculate column numbers based on the current visible columns in order
    const map = getColumnNumberMap(visibleColumns);
    setColumnNumberMap(map);
    
    // Log the column number map for debugging
    console.log("Column number map updated:", map);
    
    // Listen for fixed costs updated event
    const handleFixedCostsUpdate = () => {
      console.log("Fixed costs updated event received, recalculating column numbers");
      setColumnNumberMap(getColumnNumberMap(getVisibleColumns()));
    };
    
    window.addEventListener('fixedCostsUpdated', handleFixedCostsUpdate);
    
    return () => {
      window.removeEventListener('fixedCostsUpdated', handleFixedCostsUpdate);
    };
  }, [visibleColumns, getVisibleColumns]);
  
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
        {visibleColumns.map((column, index) => (
          <TableHead key={`number-${column}`} className="py-1 border-b">
            <div className="w-6 h-6 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {index + 1}
            </div>
          </TableHead>
        ))}
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
