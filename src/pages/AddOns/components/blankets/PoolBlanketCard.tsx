
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { PoolBlanket } from "@/types/pool-blanket";
import { formatCurrency } from "@/utils/format";

interface PoolBlanketCardProps {
  blanket: PoolBlanket;
  onEdit: (blanket: PoolBlanket) => void;
  onDelete: (id: string) => void;
}

export const PoolBlanketCard = ({ blanket, onEdit, onDelete }: PoolBlanketCardProps) => {
  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">{blanket.pool_model}</TableCell>
      <TableCell className="font-mono text-sm">{blanket.blanket_sku}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.blanket_rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.blanket_trade)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.blanket_margin)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-muted/80"
            onClick={() => onEdit(blanket)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(blanket.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
