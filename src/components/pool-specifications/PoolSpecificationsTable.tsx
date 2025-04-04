
import { useState } from "react";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TableHeader } from "./TableHeader";
import { TableContent } from "./TableContent";
import { ColumnConfigSheet } from "./ColumnConfigSheet";

// Define comprehensive column groups for better organization
export const columnGroups = [
  {
    id: "dimensions",
    title: "Dimensions",
    columns: ["length", "width", "depth_shallow", "depth_deep"],
  },
  {
    id: "volume",
    title: "Volume Information",
    columns: ["volume_liters", "waterline_l_m", "weight_kg"],
  },
  {
    id: "pricing",
    title: "Pricing",
    columns: ["buy_price_ex_gst", "buy_price_inc_gst"],
  },
  {
    id: "minerals",
    title: "Minerals & Salt",
    columns: ["minerals_kg_initial", "minerals_kg_topup", "salt_volume_bags", "salt_volume_bags_fixed"],
  },
  {
    id: "other",
    title: "Other Information",
    columns: ["pool_type_id", "default_filtration_package_id", "dig_type_id", "dig_level", "outline_image_url"],
  }
];

// Essential columns that are always visible
export const essentialColumns = ["name", "range"];

export function PoolSpecificationsTable() {
  const { data: pools, isLoading, error } = usePoolSpecifications();
  const [visibleGroups, setVisibleGroups] = useState<string[]>(["dimensions", "volume", "pricing"]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  // Check if a column should be visible
  const isColumnVisible = (columnName: string): boolean => {
    if (essentialColumns.includes(columnName)) return true;
    
    for (const group of columnGroups) {
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
