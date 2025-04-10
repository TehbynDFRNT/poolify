
import { TableCell, TableRow } from "@/components/ui/table";
import { PoolBlanket } from "@/types/pool-blanket";
import { formatCurrency } from "@/utils/format";

interface HeatPumpRowProps {
  blanket: PoolBlanket;
}

export const HeatPumpRow = ({ blanket }: HeatPumpRowProps) => {
  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">{blanket.pool_model}</TableCell>
      <TableCell className="font-mono text-sm">{blanket.heatpump_sku}</TableCell>
      <TableCell>{blanket.heatpump_description}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_trade)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_margin)}</TableCell>
    </TableRow>
  );
};
