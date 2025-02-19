
import { Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import { calculatePackagePrice } from "@/utils/package-calculations";
import type { PackageWithComponents } from "@/types/filtration";

interface FiltrationPackageCardProps {
  defaultPackage: PackageWithComponents | null;
}

export const FiltrationPackageCard = ({ defaultPackage }: FiltrationPackageCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Default Filtration Package
        </CardTitle>
      </CardHeader>
      <CardContent>
        {defaultPackage ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Option {defaultPackage.display_order}
              </h3>
              <p className="text-lg font-semibold text-primary">
                {formatCurrency(calculatePackagePrice(defaultPackage))}
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Component</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {defaultPackage.light && (
                  <TableRow>
                    <TableCell>Light</TableCell>
                    <TableCell>{defaultPackage.light.model_number}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(defaultPackage.light.price)}
                    </TableCell>
                  </TableRow>
                )}
                {defaultPackage.pump && (
                  <TableRow>
                    <TableCell>Pool Pump</TableCell>
                    <TableCell>{defaultPackage.pump.model_number}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(defaultPackage.pump.price)}
                    </TableCell>
                  </TableRow>
                )}
                {defaultPackage.sanitiser && (
                  <TableRow>
                    <TableCell>Sanitiser</TableCell>
                    <TableCell>{defaultPackage.sanitiser.model_number}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(defaultPackage.sanitiser.price)}
                    </TableCell>
                  </TableRow>
                )}
                {defaultPackage.filter && (
                  <TableRow>
                    <TableCell>Filter</TableCell>
                    <TableCell>{defaultPackage.filter.model_number}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(defaultPackage.filter.price)}
                    </TableCell>
                  </TableRow>
                )}
                {defaultPackage.handover_kit?.components.map((comp) => (
                  <TableRow key={comp.id}>
                    <TableCell>
                      {comp.component.name}
                      {comp.quantity > 1 && ` (x${comp.quantity})`}
                    </TableCell>
                    <TableCell>{comp.component.model_number}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(comp.component.price * comp.quantity)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No default filtration package assigned</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
