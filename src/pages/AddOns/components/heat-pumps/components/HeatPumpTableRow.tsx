
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/utils/format";
import { Edit2, Trash2, Pool } from "lucide-react";
import { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatPumpTableRowProps {
  product: HeatPumpProduct;
  compatiblePools?: {
    pool_range: string;
    pool_model: string;
  }[];
  onEdit: () => void;
  onDelete: () => void;
}

export const HeatPumpTableRow: React.FC<HeatPumpTableRowProps> = ({
  product,
  compatiblePools = [],
  onEdit,
  onDelete,
}) => {
  return (
    <TableRow key={product.id} className="hover:bg-muted/30 transition-colors">
      <TableCell className="font-mono text-sm">{product.hp_sku}</TableCell>
      <TableCell>{product.hp_description}</TableCell>
      <TableCell>
        {compatiblePools.length > 0 ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center">
                  <Button variant="ghost" className="h-8 p-0 text-blue-600" size="sm">
                    <Pool className="h-4 w-4 mr-1" />
                    {compatiblePools.length} pool models
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <div className="p-1">
                  <strong className="block mb-1">Compatible pools:</strong>
                  <ul className="list-disc list-inside text-xs max-h-60 overflow-y-auto">
                    {compatiblePools.map((pool, index) => (
                      <li key={index}>
                        {pool.pool_range}: {pool.pool_model}
                      </li>
                    ))}
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <span className="text-gray-400 text-sm italic">No pool models assigned</span>
        )}
      </TableCell>
      <TableCell className="text-right">{formatCurrency(product.cost)}</TableCell>
      <TableCell className="text-right">{formatCurrency(product.margin)}</TableCell>
      <TableCell className="text-right">{formatCurrency(product.rrp)}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
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
