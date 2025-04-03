
import { useState } from "react";
import { Table } from "@/components/ui/table";
import { TableHeader } from "./TableHeader";
import { PoolTableBody } from "./TableBody";
import { columnGroups, defaultVisibleGroups } from "./column-config";
import { Pool } from "@/types/pool";
import { ColumnGroup } from "./types";

interface PoolWorksheetTableProps {
  pools: Pool[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const PoolWorksheetTable = ({ pools, isLoading, error }: PoolWorksheetTableProps) => {
  const [visibleGroups, setVisibleGroups] = useState<string[]>(defaultVisibleGroups);

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

  // Log for debugging purposes
  console.log('Visible groups:', visibleGroups);
  console.log('Visible column groups:', visibleColumnGroups);

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

export { visibleGroups as VisibleGroups };
