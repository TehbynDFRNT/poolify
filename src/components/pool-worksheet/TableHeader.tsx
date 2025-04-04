
import { TableHead, TableHeader as UITableHeader, TableRow, TableCell } from "@/components/ui/table";
import { ColumnGroup, ColumnLabels } from "./types";
import { columnLabels, columnGroups as allColumnGroups } from "./column-config";
import { useState, useEffect } from "react";

interface TableHeaderProps {
  visibleColumnGroups: ColumnGroup[];
  getVisibleColumns: () => string[];
  showEssentialOnly?: boolean;
}

// Specific essential columns that correspond to 1,2,15,17,19,21,29,40,41
// The absolute positions are based on the order in the columnGroups array
// These will be highlighted when in essential mode
const essentialColumnNumbers = [1, 2, 15, 17, 19, 21, 29, 40, 41];

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

export const TableHeader = ({ 
  visibleColumnGroups, 
  getVisibleColumns,
  showEssentialOnly = false
}: TableHeaderProps) => {
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

  // Determine if a column number is part of the essential columns set
  const isEssentialColumn = (columnNumber: number) => {
    return essentialColumnNumbers.includes(columnNumber);
  };
  
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
          const columnNumber = allColumnsPositionMap[column] || 0;
          const isEssential = isEssentialColumn(columnNumber);
          
          return (
            <TableHead key={`number-${column}`} className="py-1 border-b">
              <div 
                className={`w-6 h-6 mx-auto rounded-full text-white flex items-center justify-center font-bold
                  ${isEssential ? 'bg-blue-600' : (showEssentialOnly ? 'bg-gray-400' : 'bg-blue-600')}`}
              >
                {columnNumber || "?"}
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
