
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import type { Pool } from "@/types/pool";

interface PoolTableRowProps {
  pool: Pool;
  onEdit: (pool: Pool) => void;
  onDelete: (id: string) => void;
  isColumnVisible: (column: string) => boolean;
  formatCurrency: (value: number | null) => string;
}

export function PoolTableRow({
  pool,
  onEdit,
  onDelete,
  isColumnVisible,
  formatCurrency,
}: PoolTableRowProps) {
  return (
    <TableRow>
      {isColumnVisible("Actions") && (
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(pool)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(pool.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </TableCell>
      )}
      {isColumnVisible("Name") && <TableCell>{pool.name}</TableCell>}
      {isColumnVisible("Dig Level") && <TableCell>{pool.dig_level}</TableCell>}
      {isColumnVisible("Pool Size") && <TableCell>{pool.pool_type?.name}</TableCell>}
      {isColumnVisible("Length") && <TableCell>{pool.length}m</TableCell>}
      {isColumnVisible("Width") && <TableCell>{pool.width}m</TableCell>}
      {isColumnVisible("Shallow End") && <TableCell>{pool.depth_shallow}m</TableCell>}
      {isColumnVisible("Deep End") && <TableCell>{pool.depth_deep}m</TableCell>}
      {isColumnVisible("Waterline L/M") && <TableCell>{pool.waterline_l_m}</TableCell>}
      {isColumnVisible("Water Volume (L)") && <TableCell>{pool.volume_liters}</TableCell>}
      {isColumnVisible("Salt Volume Bags") && <TableCell>{pool.salt_volume_bags}</TableCell>}
      {isColumnVisible("Salt Volume Fixed") && <TableCell>{pool.salt_volume_bags_fixed}</TableCell>}
      {isColumnVisible("Weight (KG)") && <TableCell>{pool.weight_kg}</TableCell>}
      {isColumnVisible("Minerals Initial/Topup") && (
        <TableCell>
          {pool.minerals_kg_initial}/{pool.minerals_kg_topup}
        </TableCell>
      )}
      {isColumnVisible("Buy Price (ex GST)") && (
        <TableCell>{formatCurrency(pool.buy_price_ex_gst)}</TableCell>
      )}
      {isColumnVisible("Buy Price (inc GST)") && (
        <TableCell>{formatCurrency(pool.buy_price_inc_gst)}</TableCell>
      )}
    </TableRow>
  );
}
