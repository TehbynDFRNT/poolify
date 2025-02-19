
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";
import { useState, useEffect } from "react";

interface PoolFiltrationMatchingTableProps {
  pools: any[];
  packages: PackageWithComponents[] | undefined;
  onUpdatePackage: (poolId: string, packageId: string) => void;
  isLoading?: boolean;
  isUpdating?: boolean;
}

export const PoolFiltrationMatchingTable = ({
  pools,
  packages,
  onUpdatePackage,
  isLoading = false,
  isUpdating = false,
}: PoolFiltrationMatchingTableProps) => {
  const [localSelections, setLocalSelections] = useState<Record<string, string>>({});

  // Update local selections when pools data changes
  useEffect(() => {
    const initialSelections = pools.reduce((acc, pool) => ({
      ...acc,
      [pool.id]: pool.default_filtration_package_id || ""
    }), {});
    setLocalSelections(initialSelections);
  }, [pools]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pool Filtration Matching</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const handlePackageChange = (poolId: string, packageId: string) => {
    setLocalSelections(prev => ({ ...prev, [poolId]: packageId }));
    onUpdatePackage(poolId, packageId);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pool Filtration Matching</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Range</TableHead>
              <TableHead>Pool</TableHead>
              <TableHead>Default Package</TableHead>
              <TableHead className="text-right">Package Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools?.map((pool) => (
              <TableRow key={pool.id}>
                <TableCell>{pool.range}</TableCell>
                <TableCell>{pool.name}</TableCell>
                <TableCell>
                  <Select
                    value={pool.default_filtration_package_id || ""}
                    onValueChange={(value) => handlePackageChange(pool.id, value)}
                    disabled={isUpdating}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select package">
                        {packages?.find(p => p.id === pool.default_filtration_package_id)
                          ? `Option ${packages.find(p => p.id === pool.default_filtration_package_id)?.display_order}`
                          : "Select package"
                        }
                      </SelectValue>
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
                  {pool.default_package ? formatCurrency(calculatePackagePrice(pool.default_package)) : "-"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
