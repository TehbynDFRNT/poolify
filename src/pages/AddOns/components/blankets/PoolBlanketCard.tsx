
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { PoolBlanket, calculateMarginPercentage } from "@/types/pool-blanket";
import { formatCurrency } from "@/utils/format";

interface PoolBlanketCardProps {
  blanket: PoolBlanket;
  onEdit: (blanket: PoolBlanket) => void;
  onDelete: (id: string) => void;
}

export const PoolBlanketCard = ({ blanket, onEdit, onDelete }: PoolBlanketCardProps) => {
  const blanketMarginPercent = calculateMarginPercentage(
    blanket.blanket_rrp,
    blanket.blanket_trade
  );
  
  // Calculate percentage for progress bar
  const maxMargin = 50; // 50% as a sensible ceiling for visual display
  const blanketBarWidth = Math.min(blanketMarginPercent, maxMargin) * 2;

  return (
    <TableRow>
      <TableCell>{blanket.pool_model}</TableCell>
      <TableCell>{blanket.blanket_sku}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.blanket_rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.blanket_trade)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.blanket_margin)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-full max-w-24 bg-gray-100 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${blanketBarWidth}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium whitespace-nowrap">
            {blanketMarginPercent.toFixed(1)}%
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onEdit(blanket)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
            onClick={() => onDelete(blanket.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

