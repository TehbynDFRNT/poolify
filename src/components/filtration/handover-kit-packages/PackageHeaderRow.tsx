
import React from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { HandoverKitPackage, HandoverKitPackageComponent } from "@/types/filtration";

interface PackageHeaderRowProps {
  pkg: HandoverKitPackage & { components: HandoverKitPackageComponent[] };
  onEdit: (pkg: HandoverKitPackage & { components: HandoverKitPackageComponent[] }) => void;
}

export function PackageHeaderRow({ pkg, onEdit }: PackageHeaderRowProps) {
  return (
    <TableRow className="bg-muted/30">
      <TableCell className="font-bold">{pkg.name}</TableCell>
      <TableCell>
        {pkg.components?.length || 0} items
      </TableCell>
      <TableCell className="text-right font-bold">
        {formatCurrency(
          pkg.components?.reduce(
            (total, comp) => 
              total + (comp.component?.price || 0) * comp.quantity,
            0
          ) || 0
        )}
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(pkg)}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

