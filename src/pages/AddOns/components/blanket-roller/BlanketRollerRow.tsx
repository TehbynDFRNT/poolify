
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { BlanketRoller } from "@/types/blanket-roller";

interface BlanketRollerRowProps {
  blanketRoller: BlanketRoller;
  onEdit: () => void;
  onDelete: () => void;
  hideDescription?: boolean;
}

export const BlanketRollerRow: React.FC<BlanketRollerRowProps> = ({
  blanketRoller,
  onEdit,
  onDelete,
  hideDescription = false
}) => {
  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">{blanketRoller.pool_range}</TableCell>
      <TableCell>{blanketRoller.pool_model}</TableCell>
      <TableCell className="font-mono text-sm">{blanketRoller.sku}</TableCell>
      {!hideDescription && <TableCell>{blanketRoller.description}</TableCell>}
      <TableCell className="text-right">{formatCurrency(blanketRoller.rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanketRoller.trade)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanketRoller.margin)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onEdit}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
