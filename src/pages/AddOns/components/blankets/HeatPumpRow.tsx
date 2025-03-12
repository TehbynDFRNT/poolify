
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
  
  // Calculate percentage for progress bar
  const maxMargin = 50; // 50% as a sensible ceiling for visual display
  const heatpumpBarWidth = Math.min(heatpumpMarginPercent, maxMargin) * 2;

  return (
    <TableRow>
      <TableCell>{blanket.pool_model}</TableCell>
      <TableCell>{blanket.heatpump_sku}</TableCell>
      <TableCell>{blanket.heatpump_description}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_trade)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_margin)}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="w-full max-w-24 bg-gray-100 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${heatpumpBarWidth}%` }}
            ></div>
          </div>
          <span className="text-xs font-medium whitespace-nowrap">
            {heatpumpMarginPercent.toFixed(1)}%
          </span>
        </div>
      </TableCell>
    </TableRow>
  );
};
