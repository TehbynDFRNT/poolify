
import { TableHead, TableHeader as UITableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ColumnGroup, ColumnLabels } from "./types";
import { columnLabels, columnGroups as allColumnGroups } from "./column-config";
import { useState, useEffect } from "react";

interface TableHeaderProps {
  visibleColumnGroups: ColumnGroup[];
  getVisibleColumns: () => string[];
}

// Global map of all columns to their absolute positions (1-based)
const allColumnsPositionMap: Record<string, number> = {};

// This function initializes a fixed numbering for all possible columns
const initializeAllColumnNumbers = () => {
  // Get all columns from all column groups
  const allColumns = allColumnGroups.flatMap(group => group.columns);
  
  // Assign a fixed position to each column (1-based index)
  allColumns.forEach((column, index) => {
    allColumnsPositionMap[column] = index + 1;
  });
  
  console.log("All columns position map initialized:", allColumnsPositionMap);
};

// Initialize the map on module load
initializeAllColumnNumbers();

export const TableHeader = ({ visibleColumnGroups, getVisibleColumns }: TableHeaderProps) => {
  // Get all visible columns
  const visibleColumns = getVisibleColumns();
  
  // Listen for fixed costs updated event
  useEffect(() => {
    const handleFixedCostsUpdate = () => {
      console.log("Fixed costs updated event received");
      // Reinitialize the column numbers when fixed costs update
      initializeAllColumnNumbers();
    };
    
    window.addEventListener('fixedCostsUpdated', handleFixedCostsUpdate);
    
    return () => {
      window.removeEventListener('fixedCostsUpdated', handleFixedCostsUpdate);
    };
  }, []);
  
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
        {visibleColumns.map((column) => (
          <TableHead key={`number-${column}`} className="py-1 border-b">
            <div className="w-6 h-6 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
              {allColumnsPositionMap[column] || "?"}
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
