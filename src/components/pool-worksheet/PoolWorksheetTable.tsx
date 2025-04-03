
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
}

export const PoolWorksheetTable = ({ 
  pools, 
  isLoading, 
  error, 
  visibleGroups, 
  setVisibleGroups 
}: PoolWorksheetTableProps) => {
  // Get all columns from visible groups
  const getVisibleColumns = () => {
    return columnGroups
      .filter(group => visibleGroups.includes(group.id))
      .flatMap(group => group.columns);
  };

  // Get all visible column groups with their columns
  const visibleColumnGroups = columnGroups.filter(group => 
    visibleGroups.includes(group.id)
  );

  return (
    <div className="overflow-x-auto border rounded-md">
      <Table>
        <TableHeader 
          visibleColumnGroups={visibleColumnGroups}
          getVisibleColumns={getVisibleColumns}
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
