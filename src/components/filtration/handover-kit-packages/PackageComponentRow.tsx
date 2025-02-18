
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/utils/format";
import type { HandoverKitPackageComponent } from "@/types/filtration";

interface PackageComponentRowProps {
  component: HandoverKitPackageComponent;
  packageId: string;
  editingComponent: { packageId: string; componentId: string; quantity: number } | null;
  onStartEdit: (packageId: string, componentId: string, quantity: number) => void;
  onUpdateQuantity: (packageId: string, componentId: string, quantity: number) => void;
}

export function PackageComponentRow({
  component,
  packageId,
  editingComponent,
  onStartEdit,
  onUpdateQuantity,
}: PackageComponentRowProps) {
  return (
    <TableRow className="text-sm">
      <TableCell className="pl-8">
        {component.component?.model_number}
      </TableCell>
      <TableCell>
        {component.component?.name}
      </TableCell>
      <TableCell className="text-right">
        {editingComponent?.packageId === packageId && 
         editingComponent?.componentId === component.component_id ? (
          <div className="flex items-center justify-end gap-2">
            <Input
              type="number"
              min={1}
              value={editingComponent.quantity}
              onChange={(e) => onStartEdit(
                packageId,
                component.component_id,
                parseInt(e.target.value)
              )}
              className="w-20"
              autoFocus
              onBlur={() => {
                onUpdateQuantity(
                  packageId,
                  component.component_id,
                  editingComponent.quantity
                );
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateQuantity(
                    packageId,
                    component.component_id,
                    editingComponent.quantity
                  );
                }
              }}
            />
          </div>
        ) : (
          <div
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded"
            onClick={() => onStartEdit(
              packageId,
              component.component_id,
              component.quantity
            )}
          >
            {formatCurrency((component.component?.price || 0) * component.quantity)}
            <span className="text-muted-foreground ml-2">
              (x{component.quantity})
            </span>
          </div>
        )}
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
