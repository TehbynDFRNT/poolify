
import { TableCell, TableRow } from "@/components/ui/table";
import { PoolBlanket, calculateMarginPercentage } from "@/types/pool-blanket";
import { formatCurrency } from "@/utils/format";

interface HeatPumpRowProps {
  blanket: PoolBlanket;
}

export const HeatPumpRow = ({ blanket }: HeatPumpRowProps) => {
  const heatpumpMarginPercent = calculateMarginPercentage(
    blanket.heatpump_rrp,
    blanket.heatpump_trade
  );

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">{blanket.pool_model}</TableCell>
      <TableCell className="font-mono text-sm">{blanket.heatpump_sku}</TableCell>
      <TableCell>{blanket.heatpump_description}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_trade)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_margin)}</TableCell>
      <TableCell className="text-right">
        <span className={`inline-block px-2 py-1 rounded-md text-xs font-medium ${
          heatpumpMarginPercent < 15 ? "bg-red-100 text-red-800" :
          heatpumpMarginPercent < 30 ? "bg-amber-100 text-amber-800" :
          "bg-blue-100 text-blue-800"
        }`}>
          {heatpumpMarginPercent.toFixed(1)}%
        </span>
      </TableCell>
    </TableRow>
  );
};
