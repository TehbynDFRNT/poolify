
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
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";
import { useState } from "react";

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
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [tempSelection, setTempSelection] = useState<string>("");

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

  const handleEdit = (poolId: string, currentPackageId: string) => {
    setEditingRow(poolId);
    setTempSelection(currentPackageId || "");
  };

  const handleSave = async (poolId: string) => {
    if (tempSelection && tempSelection !== "") {
      onUpdatePackage(poolId, tempSelection);
      setEditingRow(null);
      setTempSelection("");
    }
  };

  const handleCancel = () => {
    setEditingRow(null);
    setTempSelection("");
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
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pools?.map((pool) => {
              const selectedPackage = packages?.find(p => p.id === pool.default_filtration_package_id);
              return (
                <TableRow key={pool.id}>
                  <TableCell>{pool.range}</TableCell>
                  <TableCell>{pool.name}</TableCell>
                  <TableCell>
                    {editingRow === pool.id ? (
                      <Select
                        value={tempSelection}
                        onValueChange={setTempSelection}
                        disabled={isUpdating}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select package">
                            {packages?.find(p => p.id === tempSelection)
                              ? `Option ${packages.find(p => p.id === tempSelection)?.display_order}`
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
                    ) : (
                      <div className="w-[200px] py-2">
                        {selectedPackage 
                          ? `Option ${selectedPackage.display_order}`
                          : "No package selected"
                        }
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {pool.default_package ? formatCurrency(calculatePackagePrice(pool.default_package)) : "-"}
                  </TableCell>
                  <TableCell>
                    {editingRow === pool.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSave(pool.id)}
                          disabled={isUpdating}
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCancel}
                          disabled={isUpdating}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(pool.id, pool.default_filtration_package_id)}
                        disabled={isUpdating}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
