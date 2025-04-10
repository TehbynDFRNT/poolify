
import { TableCell, TableRow } from "@/components/ui/table";
import { PoolBlanket, calculateMarginPercentage } from "@/types/pool-blanket";
import { formatCurrency } from "@/utils/format";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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

  // Determine margin color based on percentage
  const getMarginColor = (percentage: number) => {
    if (percentage < 15) return "bg-red-500";
    if (percentage < 30) return "bg-amber-500";
    return "bg-blue-500";
  };

  const marginBarColor = getMarginColor(heatpumpMarginPercent);

  return (
    <TableRow className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-medium">{blanket.pool_model}</TableCell>
      <TableCell className="font-mono text-sm">{blanket.heatpump_sku}</TableCell>
      <TableCell>{blanket.heatpump_description}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_trade)}</TableCell>
      <TableCell className="text-right">{formatCurrency(blanket.heatpump_margin)}</TableCell>
      <TableCell>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <div className="w-full max-w-24 bg-gray-100 rounded-full h-2.5">
                  <div 
                    className={`${marginBarColor} h-2.5 rounded-full transition-all duration-300`} 
                    style={{ width: `${heatpumpBarWidth}%` }}
                  ></div>
                </div>
                <span className="text-xs font-medium whitespace-nowrap">
                  {heatpumpMarginPercent.toFixed(1)}%
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Profit margin: {heatpumpMarginPercent.toFixed(2)}%</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
    </TableRow>
  );
};
