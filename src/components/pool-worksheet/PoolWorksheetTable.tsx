
import { useState } from "react";
import { Table } from "@/components/ui/table";
import { TableHeader } from "./TableHeader";
import { PoolTableBody } from "./TableBody";
import { columnGroups, defaultVisibleGroups } from "./column-config";
import { Pool } from "@/types/pool";

interface PoolWorksheetTableProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  error: Error | null;
  visibleGroups: string[];
  setVisibleGroups: (groups: string[]) => void;
  showEssentialOnly?: boolean;
}

export const PoolWorksheetTable = ({ 
  pools, 
  isLoading, 
  error, 
  visibleGroups, 
  setVisibleGroups,
  showEssentialOnly = false
}: PoolWorksheetTableProps) => {
  // Get all columns from visible groups
  const getVisibleColumns = () => {
    // First get identification columns
    const identificationGroup = columnGroups.find(group => group.id === 'identification');
    const identificationColumns = identificationGroup ? identificationGroup.columns : [];
    
    // Then get other visible column groups
    const otherColumns = columnGroups
      .filter(group => group.id !== 'identification' && visibleGroups.includes(group.id))
      .flatMap(group => group.columns);
    
    // Return identification columns first, then other columns
    return [...identificationColumns, ...otherColumns];
  };

  // Get all visible column groups with their columns
  const visibleColumnGroups = columnGroups.filter(group => 
    visibleGroups.includes(group.id) || group.id === 'identification'
  );

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader 
          visibleColumnGroups={visibleColumnGroups}
          getVisibleColumns={getVisibleColumns}
          showEssentialOnly={showEssentialOnly}
        />
        <PoolTableBody 
          pools={pools}
          isLoading={isLoading}
          error={error}
          getVisibleColumns={getVisibleColumns}
        />
      </Table>
    </div>
  );
};
