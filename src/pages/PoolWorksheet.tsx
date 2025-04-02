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
import { usePoolPackages } from "@/hooks/usePoolPackages";
import { calculatePackagePrice } from "@/utils/package-calculations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    title: "Pool Pricing",
    color: "bg-blue-100 text-blue-800",
    columns: ["buy_price_ex_gst", "buy_price_inc_gst"]
  },
  {
    id: "filtration",
    title: "Filtration Package",
    color: "bg-green-100 text-green-800",
    columns: ["default_package", "package_price"]
  },
  {
    id: "construction_costs",
    title: "Pool Individual Costs",
    color: "bg-amber-100 text-amber-800",
    columns: ["excavation", "pea_gravel", "install_fee", "trucked_water", "salt_bags", "coping_supply", "beam", "coping_lay", "total_cost"]
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
  "default_package": "Filtration Package",
  "package_price": "Package Price",
  "excavation": "Excavation",
  "pea_gravel": "Pea Gravel",
  "install_fee": "Install Fee",
  "trucked_water": "Trucked Water",
  "salt_bags": "Salt Bags",
  "coping_supply": "Coping Supply",
  "beam": "Beam",
  "coping_lay": "Coping Lay",
  "total_cost": "Total Cost",
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
  const { data: pools, isLoading: isLoadingPools, error: poolsError } = usePoolSpecifications();
  const { poolsWithPackages, isLoading: isLoadingPackages } = usePoolPackages();
  
  // Fetch pool costs
  const { data: poolCosts, isLoading: isLoadingCosts } = useQuery({
    queryKey: ["pool-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_costs")
        .select("*");
      
      if (error) throw error;
      
      const costsMap = new Map();
      data?.forEach(cost => {
        costsMap.set(cost.pool_id, cost);
      });
      
      return costsMap;
    }
  });

  // Fetch dig types for excavation costs calculation
  const { data: poolDigMatches } = useQuery({
    queryKey: ["pool-dig-type-matches"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pool_dig_type_matches")
        .select(`
          id,
          pool_id,
          dig_type_id,
          dig_type:dig_types(*)
        `);
      
      if (error) throw error;
      
      const matchesMap = new Map();
      data?.forEach(match => {
        matchesMap.set(match.pool_id, match);
      });
      
      return matchesMap;
    }
  });
  
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

  // Create a lookup object for packages by pool ID
  const packagesByPoolId = poolsWithPackages?.reduce((acc, pool) => {
    if (pool.default_filtration_package_id && pool.default_package) {
      acc[pool.id] = pool.default_package;
    }
    return acc;
  }, {} as Record<string, any>) || {};

  // Calculate excavation cost for a pool
  const calculateExcavationCost = (poolId: string) => {
    const match = poolDigMatches?.get(poolId);
    if (!match || !match.dig_type) return 0;
    
    const digType = match.dig_type;
    const excavationCost = (digType.excavation_hours * digType.excavation_hourly_rate) +
                            (digType.truck_quantity * digType.truck_hours * digType.truck_hourly_rate);
    
    return excavationCost;
  };

  const isLoading = isLoadingPools || isLoadingPackages || isLoadingCosts;
  const error = poolsError;

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
                      // Handle filtration package columns
                      if (column === "default_package") {
                        const package_info = packagesByPoolId[pool.id];
                        return (
                          <TableCell key={`${pool.id}-${column}`}>
                            {package_info ? `Option ${package_info.display_order}` : '-'}
                          </TableCell>
                        );
                      } else if (column === "package_price") {
                        const package_info = packagesByPoolId[pool.id];
                        return (
                          <TableCell key={`${pool.id}-${column}`}>
                            {package_info ? formatCurrency(calculatePackagePrice(package_info)) : '-'}
                          </TableCell>
                        );
                      }
                      
                      // Handle construction costs columns
                      const poolCost = poolCosts?.get(pool.id) || {};
                      
                      if (column === "excavation") {
                        const excavationCost = calculateExcavationCost(pool.id);
                        return (
                          <TableCell key={`${pool.id}-${column}`}>
                            {formatCurrency(excavationCost)}
                          </TableCell>
                        );
                      } else if (column === "total_cost") {
                        const excavationCost = calculateExcavationCost(pool.id);
                        const total = 
                          excavationCost + 
                          (poolCost.pea_gravel || 0) + 
                          (poolCost.install_fee || 0) + 
                          (poolCost.trucked_water || 0) + 
                          (poolCost.salt_bags || 0) + 
                          (poolCost.coping_supply || 0) + 
                          (poolCost.beam || 0) + 
                          (poolCost.coping_lay || 0);
                        
                        return (
                          <TableCell key={`${pool.id}-${column}`} className="font-medium">
                            {formatCurrency(total)}
                          </TableCell>
                        );
                      } else if ([
                        "pea_gravel", 
                        "install_fee", 
                        "trucked_water", 
                        "salt_bags", 
                        "coping_supply", 
                        "beam", 
                        "coping_lay"
                      ].includes(column)) {
                        return (
                          <TableCell key={`${pool.id}-${column}`}>
                            {formatCurrency(poolCost[column] || 0)}
                          </TableCell>
                        );
                      }
                      
                      // Handle regular pool specification columns
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
