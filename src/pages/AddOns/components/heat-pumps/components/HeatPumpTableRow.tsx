
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";

interface HeatPumpTableRowProps {
  product: HeatPumpProduct;
  onEdit: (product: HeatPumpProduct) => void;
  onDelete: (product: HeatPumpProduct) => void;
}

export const HeatPumpTableRow = ({ product, onEdit, onDelete }: HeatPumpTableRowProps) => {
  return (
    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-mono">{product.hp_sku}</TableCell>
      <TableCell>{product.hp_description}</TableCell>
      <TableCell className="text-right">{formatCurrency(product.cost)}</TableCell>
      <TableCell className="text-right">{formatCurrency(product.margin)}</TableCell>
      <TableCell className="text-right">{formatCurrency(product.rrp)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(product)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
