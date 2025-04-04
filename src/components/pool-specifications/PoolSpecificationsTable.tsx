
import { useState } from "react";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { TableHeader } from "./TableHeader";
import { TableContent } from "./TableContent";
import { ColumnConfigSheet, criticalColumns, toggleableColumnGroups } from "./ColumnConfigSheet";

// Essential columns that are always visible
export const essentialColumns = criticalColumns;

export function PoolSpecificationsTable() {
  const { data: pools, isLoading, error } = usePoolSpecifications();
  const [visibleGroups, setVisibleGroups] = useState<string[]>(["details"]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Check if a column should be visible
  const isColumnVisible = (columnName: string): boolean => {
    // Critical columns are always visible
    if (essentialColumns.includes(columnName)) return true;
    
    // Check if column is in any visible group
    for (const group of toggleableColumnGroups) {
      if (group.columns.includes(columnName) && visibleGroups.includes(group.id)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Pool Specifications</h3>
        <div className="flex gap-2">
          <ColumnConfigSheet 
            isOpen={isConfigOpen}
            setIsOpen={setIsConfigOpen}
            visibleGroups={visibleGroups}
            setVisibleGroups={setVisibleGroups}
          />
        </div>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader 
            pools={pools}
            isLoading={isLoading} 
            isColumnVisible={isColumnVisible}
          />
          <TableContent 
            pools={pools}
            isLoading={isLoading}
            error={error}
            isColumnVisible={isColumnVisible}
          />
        </Table>
      </div>
    </div>
  );
}
