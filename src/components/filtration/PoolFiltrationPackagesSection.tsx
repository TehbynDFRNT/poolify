
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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { PackageWithComponents } from "@/types/filtration";

interface PoolFiltrationPackagesSectionProps {
  packages: PackageWithComponents[] | undefined;
}

export function PoolFiltrationPackagesSection({ packages }: PoolFiltrationPackagesSectionProps) {
  const [selectedPackages, setSelectedPackages] = React.useState<Record<string, string>>({});

  const { data: pools } = useQuery({
    queryKey: ["pool-specifications"],
    queryFn: async () => {
      const { data: ranges } = await supabase
        .from("pool_ranges")
        .select("name")
        .order("display_order");

      const { data: poolsData, error } = await supabase
        .from("pool_specifications")
        .select("*");

      if (error) throw error;

      // Sort pools based on range order
      const rangeOrder = ranges?.map(r => r.name) || [];
      return (poolsData || []).sort((a, b) => {
        const aIndex = rangeOrder.indexOf(a.range);
        const bIndex = rangeOrder.indexOf(b.range);
        return aIndex - bIndex;
      }) as Pool[];
    },
  });

  const calculatePackageTotal = (pkg: PackageWithComponents) => {
    const handoverKitTotal = pkg.handover_kit?.components.reduce((total, comp) => {
      return total + ((comp.component?.price || 0) * comp.quantity);
    }, 0) || 0;

    return (
      (pkg.light?.price || 0) +
      (pkg.pump?.price || 0) +
      (pkg.sanitiser?.price || 0) +
      (pkg.filter?.price || 0) +
      handoverKitTotal
    );
  };

  const handlePackageChange = (poolId: string, packageId: string) => {
    setSelectedPackages(prev => ({
      ...prev,
      [poolId]: packageId
    }));
  };

  const getSelectedPackageTotal = (poolId: string) => {
    const selectedPackageId = selectedPackages[poolId];
    const selectedPackage = packages?.find(p => p.id === selectedPackageId);
    return selectedPackage ? calculatePackageTotal(selectedPackage) : 0;
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
              <TableRow key={pool.id}>
                <TableCell>{pool.name}</TableCell>
                <TableCell>
                  <Select
                    value={selectedPackages[pool.id] || ""}
                    onValueChange={(value) => handlePackageChange(pool.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
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
                  {formatCurrency(getSelectedPackageTotal(pool.id))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
