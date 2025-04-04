
import { useState } from "react";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import {
  Table,
} from "@/components/ui/table";
import { TableHeader } from "./TableHeader";
import { TableContent } from "./TableContent";
import { ColumnConfigSheet, criticalColumns, toggleableColumnGroups, essentialColumnSet } from "./ColumnConfigSheet";
import { Button } from "@/components/ui/button";
import { Settings, List } from "lucide-react";

export function PoolSpecificationsTable() {
  const { data: pools, isLoading, error } = usePoolSpecifications();
  const [visibleGroups, setVisibleGroups] = useState<string[]>(["details"]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [showEssentialOnly, setShowEssentialOnly] = useState(false);

  // Check if a column should be visible
  const isColumnVisible = (columnName: string): boolean => {
    // If essential only mode is active, only show essential columns
    if (showEssentialOnly) {
      return essentialColumnSet.includes(columnName);
    }
    
    // Critical columns are always visible
    if (criticalColumns.includes(columnName)) return true;
    
    // Check if column is in any visible group
    for (const group of toggleableColumnGroups) {
      if (group.columns.includes(columnName) && visibleGroups.includes(group.id)) {
        return true;
      }
    }
    return false;
  };

  const toggleEssentialColumnsOnly = () => {
    setShowEssentialOnly(!showEssentialOnly);
    if (!showEssentialOnly) {
      setVisibleGroups([]);
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Pool Specifications</h3>
        <div className="flex gap-2">
          <Button 
            variant={showEssentialOnly ? "default" : "outline"} 
            size="sm"
            onClick={toggleEssentialColumnsOnly}
            className="flex items-center gap-2"
          >
            <List size={16} />
            {showEssentialOnly ? "Essential Columns Only" : "Show All Columns"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsConfigOpen(true)}
            className="flex items-center gap-2"
          >
            <Settings size={16} />
            Configure Columns
          </Button>
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
