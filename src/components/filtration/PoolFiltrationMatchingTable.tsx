
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";

interface PoolFiltrationMatchingTableProps {
  pools: any[];
  packages: PackageWithComponents[] | undefined;
  onUpdatePackage: (poolId: string, packageId: string) => void;
}

export const PoolFiltrationMatchingTable = ({
  pools,
  packages,
  onUpdatePackage,
}: PoolFiltrationMatchingTableProps) => {
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
                    onValueChange={(value) => onUpdatePackage(pool.id, value)}
                  >
                    <SelectTrigger className="w-[200px]">
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
