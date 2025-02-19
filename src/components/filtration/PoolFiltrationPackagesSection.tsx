
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
import { ChevronDown } from "lucide-react";

interface PoolFiltrationPackagesSectionProps {
  packages: PackageWithComponents[] | undefined;
}

export function PoolFiltrationPackagesSection({ packages }: PoolFiltrationPackagesSectionProps) {
  const [selectedPackages, setSelectedPackages] = React.useState<Record<string, string>>({});
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
      return (poolsData as Pool[] || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      });
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
    }
  }, [pools]);

  const handlePackageChange = async (poolId: string, packageId: string) => {
    try {
      const { error } = await supabase
        .from("pool_specifications")
        .update({ standard_filtration_package_id: packageId })
        .eq("id", poolId);

      if (error) throw error;

      setSelectedPackages(prev => ({
        ...prev,
        [poolId]: packageId
      }));

      // Expand the row to show the details
      setExpandedRow(poolId);

      // Invalidate the pool specifications query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["pool-specifications"] });
      toast.success("Filtration package updated successfully");
    } catch (error) {
      console.error("Error updating filtration package:", error);
      toast.error("Failed to update filtration package");
    }
  };

  const getSelectedPackageDetails = (poolId: string) => {
    const selectedPackageId = selectedPackages[poolId];
    return packages?.find(p => p.id === selectedPackageId);
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
              <TableHead className="text-right">Package Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools?.map((pool) => (
              <React.Fragment key={pool.id}>
                <TableRow 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => toggleExpandedRow(pool.id)}
                >
                  <TableCell>{pool.name}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={selectedPackages[pool.id] || ""}
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
                  <TableCell className="text-right">
                    {formatCurrency(calculateFiltrationTotal(getSelectedPackageDetails(pool.id)))}
                  </TableCell>
                </TableRow>
                {expandedRow === pool.id && getSelectedPackageDetails(pool.id) && (
                  <FiltrationPackageDetails
                    package={getSelectedPackageDetails(pool.id)!}
                    colSpan={3}
                  />
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
