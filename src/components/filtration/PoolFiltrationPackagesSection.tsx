
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { PackageWithComponents } from "@/types/filtration";
import { FiltrationPackageDetails } from "../pools/components/FiltrationPackageDetails";
import { calculateFiltrationTotal } from "../pools/utils/filtrationCalculations";
import { toast } from "sonner";
import { ChevronDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PoolFiltrationPackagesSectionProps {
  packages: PackageWithComponents[] | undefined;
}

export function PoolFiltrationPackagesSection({ packages }: PoolFiltrationPackagesSectionProps) {
  const [selectedPackages, setSelectedPackages] = React.useState<Record<string, string>>({});
  const [pendingChanges, setPendingChanges] = React.useState<Record<string, string>>({});
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: pools } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select(`
          *,
          standard_filtration_package:filtration_packages(
            id,
            name,
            display_order,
            light:filtration_components!light_id(id, name, model_number, price),
            pump:filtration_components!pump_id(id, name, model_number, price),
            sanitiser:filtration_components!sanitiser_id(id, name, model_number, price),
            filter:filtration_components!filter_id(id, name, model_number, price),
            handover_kit:handover_kit_packages!handover_kit_id(
              id,
              name,
              components:handover_kit_package_components(
                id,
                quantity,
                component:filtration_components!component_id(
                  id,
                  name,
                  model_number,
                  price
                )
              )
            )
          )
        `);

      if (error) throw error;

      const rangeOrder = ranges?.map(r => r.name) || [];
      return poolsData as Pool[];
    },
  });

  React.useEffect(() => {
    if (pools) {
      const initialSelections: Record<string, string> = {};
      pools.forEach((pool) => {
        if (pool.standard_filtration_package?.id) {
          initialSelections[pool.id] = pool.standard_filtration_package.id;
        }
      });
      setSelectedPackages(initialSelections);
      setPendingChanges({});
    }
  }, [pools]);

  const handlePackageChange = (poolId: string, packageId: string) => {
    setPendingChanges(prev => ({
      ...prev,
      [poolId]: packageId
    }));
  };

  const handleSaveChanges = async (poolId: string) => {
    const newPackageId = pendingChanges[poolId];
    if (!newPackageId) return;

    try {
      const { error } = await supabase
        .from("pool_specifications")
        .update({ standard_filtration_package_id: newPackageId })
        .eq("id", poolId);

      if (error) throw error;

      setSelectedPackages(prev => ({
        ...prev,
        [poolId]: newPackageId
      }));

      // Clear the pending change after successful save
      setPendingChanges(prev => {
        const { [poolId]: _, ...rest } = prev;
        return rest;
      });

      // Invalidate the pool specifications query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Filtration package updated successfully");
    } catch (error) {
      console.error("Error updating filtration package:", error);
      toast.error("Failed to update filtration package");
    }
  };

  const getPackageDetails = (poolId: string, isPending: boolean = false) => {
    const packageId = isPending ? pendingChanges[poolId] : selectedPackages[poolId];
    return packages?.find(p => p.id === packageId);
  };

  const toggleExpandedRow = (poolId: string) => {
    setExpandedRow(expandedRow === poolId ? null : poolId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Filtration Package Selection</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool Name</TableHead>
              <TableHead>Filtration Package</TableHead>
              <TableHead>Actions</TableHead>
              <TableHead className="text-right">Package Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools?.map((pool) => {
              const hasPendingChange = pendingChanges[pool.id] !== undefined;
              const pendingPackage = getPackageDetails(pool.id, true);
              const currentPackage = getPackageDetails(pool.id, false);
              
              return (
                <React.Fragment key={pool.id}>
                  <TableRow 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => toggleExpandedRow(pool.id)}
                  >
                    <TableCell>{pool.name}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={hasPendingChange ? pendingChanges[pool.id] : selectedPackages[pool.id] || ""}
                        onValueChange={(value) => handlePackageChange(pool.id, value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select package" />
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </SelectTrigger>
                        <SelectContent>
                          {packages?.map((pkg) => (
                            <SelectItem key={pkg.id} value={pkg.id}>
                              Option {pkg.display_order}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      {hasPendingChange && (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveChanges(pool.id)}
                            className="flex items-center gap-2"
                          >
                            <Save className="h-4 w-4" />
                            Save Changes
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setPendingChanges(prev => {
                              const { [pool.id]: _, ...rest } = prev;
                              return rest;
                            })}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(calculateFiltrationTotal(hasPendingChange ? pendingPackage : currentPackage))}
                      {hasPendingChange && currentPackage && (
                        <div className="text-sm text-muted-foreground line-through">
                          {formatCurrency(calculateFiltrationTotal(currentPackage))}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                  {expandedRow === pool.id && (hasPendingChange ? pendingPackage : currentPackage) && (
                    <FiltrationPackageDetails
                      package={hasPendingChange ? pendingPackage! : currentPackage!}
                      colSpan={4}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
