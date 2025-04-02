
import { useState } from "react";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Pool } from "@/types/pool";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Define comprehensive column groups for better organization
const columnGroups = [
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
    id: "minerals",
    title: "Minerals & Salt",
    columns: ["minerals_kg_initial", "minerals_kg_topup", "salt_volume_bags", "salt_volume_bags_fixed"],
  },
  {
    id: "pricing",
    title: "Pricing",
    columns: ["buy_price_ex_gst", "buy_price_inc_gst"],
  },
  {
    id: "other",
    title: "Other Information",
    columns: ["pool_type_id", "default_filtration_package_id", "dig_type_id", "dig_level", "outline_image_url"],
  }
];

// Essential columns that are always visible
const essentialColumns = ["range", "name"];

export function PoolSpecificationsTable() {
  // Using the hook that properly sorts by range order
  const { data: pools, isLoading, error } = usePoolSpecifications();
  const [visibleGroups, setVisibleGroups] = useState<string[]>(["dimensions", "volume", "pricing"]);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const toggleColumnGroup = (groupId: string) => {
    if (visibleGroups.includes(groupId)) {
      setVisibleGroups(visibleGroups.filter(id => id !== groupId));
    } else {
      setVisibleGroups([...visibleGroups, groupId]);
    }
  };

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

  if (isLoading) {
    return <div className="flex justify-center p-6">Loading pool specifications...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-6">Error loading pool specifications</div>;
  }

  if (!pools || pools.length === 0) {
    return (
      <div className="text-center p-16 border border-dashed rounded-md">
        <p className="text-muted-foreground">No pool specifications available</p>
      </div>
    );
  }

  // Get all column keys from the first pool object
  const allColumns = Object.keys(pools[0]).filter(key => 
    key !== 'id' && 
    !key.startsWith('_') && 
    key !== 'created_at' && 
    key !== 'updated_at'
  );

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Pool Specifications</h3>
        <div className="flex gap-2">
          <Sheet open={isConfigOpen} onOpenChange={setIsConfigOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                Configure Columns
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Column Visibility</SheetTitle>
                <SheetDescription>
                  Toggle which column groups are visible in the table
                </SheetDescription>
              </SheetHeader>
              <div className="py-4">
                {columnGroups.map((group) => (
                  <div key={group.id} className="flex items-center justify-between py-2">
                    <div>
                      <h4 className="font-medium">{group.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {group.columns.length} columns
                      </p>
                    </div>
                    <Button
                      onClick={() => toggleColumnGroup(group.id)}
                      variant={visibleGroups.includes(group.id) ? "default" : "outline"}
                      size="sm"
                    >
                      {visibleGroups.includes(group.id) ? "Hide" : "Show"}
                    </Button>
                  </div>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {allColumns.map((column) => {
                if (!isColumnVisible(column)) return null;
                
                // Format the column header
                const formattedHeader = column
                  .split('_')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                return (
                  <TableHead 
                    key={column}
                    className={column === "range" || column === "name" ? "" : "text-right"}
                  >
                    {formattedHeader}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools.map((pool) => (
              <TableRow key={pool.id}>
                {allColumns.map((column) => {
                  if (!isColumnVisible(column)) return null;
                  
                  const value = pool[column as keyof Pool];
                  let displayValue = value;
                  
                  // Format numeric values with thousands separator
                  if (typeof value === 'number') {
                    if (column.includes('price') || column.includes('cost')) {
                      // Currency formatting
                      displayValue = `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                    } else {
                      // Regular number formatting
                      displayValue = value.toLocaleString();
                    }
                  }
                  
                  return (
                    <TableCell 
                      key={`${pool.id}-${column}`}
                      className={column === "range" || column === "name" ? "" : "text-right"}
                    >
                      {displayValue || '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
