
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePoolSpecifications } from "@/pages/ConstructionCosts/hooks/usePoolSpecifications";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Define column groups for organizing the table columns
const columnGroups = [
  {
    id: "identification",
    title: "Pool Identification",
    color: "bg-blue-100 text-blue-800",
    columns: ["name", "range"]
  },
  {
    id: "dimensions",
    title: "Pool Dimensions",
    color: "bg-blue-100 text-blue-800",
    columns: ["length", "width", "depth_shallow", "depth_deep"]
  },
  {
    id: "volume",
    title: "Volume Information",
    color: "bg-blue-100 text-blue-800",
    columns: ["waterline_l_m", "volume_liters", "weight_kg"]
  },
  {
    id: "minerals",
    title: "Salt & Minerals",
    color: "bg-blue-100 text-blue-800",
    columns: ["salt_volume_bags", "salt_volume_bags_fixed", "minerals_kg_initial", "minerals_kg_topup"]
  },
  {
    id: "pricing",
    title: "Pricing",
    color: "bg-blue-100 text-blue-800",
    columns: ["buy_price_ex_gst", "buy_price_inc_gst"]
  }
];

// Map of column keys to display names
const columnLabels: Record<string, string> = {
  "name": "Name",
  "range": "Range",
  "length": "Length",
  "width": "Width",
  "depth_shallow": "Depth (Shallow)",
  "depth_deep": "Depth (Deep)",
  "waterline_l_m": "Waterline (L/m)",
  "volume_liters": "Volume (L)",
  "weight_kg": "Weight (kg)",
  "salt_volume_bags": "Salt Bags",
  "salt_volume_bags_fixed": "Salt Bags (Fixed)",
  "minerals_kg_initial": "Initial Minerals (kg)",
  "minerals_kg_topup": "Topup Minerals (kg)",
  "buy_price_ex_gst": "Buy Price (ex GST)",
  "buy_price_inc_gst": "Buy Price (inc GST)",
};

// Column configuration component
const ColumnConfigSheet = ({ 
  visibleGroups, 
  setVisibleGroups 
}: { 
  visibleGroups: string[]; 
  setVisibleGroups: (groups: string[]) => void;
}) => {
  const toggleColumnGroup = (groupId: string) => {
    if (visibleGroups.includes(groupId)) {
      setVisibleGroups(visibleGroups.filter(id => id !== groupId));
    } else {
      setVisibleGroups([...visibleGroups, groupId]);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2"
        >
          <Settings size={16} />
          Configure Columns
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Configure Columns</SheetTitle>
          <SheetDescription>
            Toggle column groups to display in the table
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          {columnGroups.map((group) => (
            <div key={group.id} className="flex items-center justify-between py-2 border-b">
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
  );
};

const PoolWorksheet = () => {
  const { data: pools, isLoading, error } = usePoolSpecifications();
  
  // State to track which column groups are visible
  const [visibleGroups, setVisibleGroups] = useState<string[]>(
    columnGroups.map(group => group.id) // Initially all groups are visible
  );

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
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/" className="transition-colors hover:text-foreground">
                Home
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              Pool Worksheet
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Pool Worksheet</h1>
            <p className="text-muted-foreground mt-1">
              A comprehensive breakdown of all pool specifications
            </p>
          </div>
          
          <ColumnConfigSheet 
            visibleGroups={visibleGroups} 
            setVisibleGroups={setVisibleGroups} 
          />
        </div>
        
        <div className="overflow-x-auto border rounded-md">
          <Table>
            <TableHeader>
              {/* Render group headers */}
              <TableRow>
                {visibleColumnGroups.map(group => (
                  <TableCell 
                    key={`header-${group.id}`} 
                    colSpan={group.columns.length} 
                    className={`${group.color} font-medium py-2 px-4 text-left border-b border-r`}
                  >
                    {group.title}
                  </TableCell>
                ))}
              </TableRow>
              
              {/* Render column headers */}
              <TableRow>
                {getVisibleColumns().map(column => (
                  <TableHead key={column}>
                    {columnLabels[column] || column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={getVisibleColumns().length} className="text-center py-4">
                    Loading pool specifications...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={getVisibleColumns().length} className="text-center py-4 text-red-500">
                    Error loading pool specifications
                  </TableCell>
                </TableRow>
              ) : pools && pools.length > 0 ? (
                pools.map((pool) => (
                  <TableRow key={pool.id}>
                    {getVisibleColumns().map(column => {
                      const value = pool[column as keyof typeof pool];
                      
                      // Format the value based on column type
                      let displayValue: string | number | null = value as string | number | null;
                      
                      if (column === "length" || column === "width" || 
                          column === "depth_shallow" || column === "depth_deep" || 
                          column === "waterline_l_m") {
                        if (typeof value === 'number') {
                          displayValue = `${value.toFixed(2)}m`;
                        }
                      } else if (column === "volume_liters") {
                        if (typeof value === 'number') {
                          displayValue = `${value.toLocaleString()}L`;
                        }
                      } else if (column === "weight_kg") {
                        if (typeof value === 'number') {
                          displayValue = `${value.toLocaleString()}kg`;
                        }
                      } else if (column === "buy_price_ex_gst" || column === "buy_price_inc_gst") {
                        if (typeof value === 'number') {
                          displayValue = formatCurrency(value);
                        }
                      }
                      
                      return (
                        <TableCell key={`${pool.id}-${column}`}>
                          {displayValue || '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={getVisibleColumns().length} className="text-center py-4">
                    No pool specifications available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PoolWorksheet;
