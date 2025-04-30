
import React, { useState } from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import { HeatPumpSelect } from "./HeatPumpSelect";
import type { HeatPumpProduct } from "@/hooks/useHeatPumpProducts";
import type { HeatPumpPoolMatch } from "@/hooks/useHeatPumpMatrix";

interface HeatPumpMatrixRowProps {
  match: HeatPumpPoolMatch;
  heatPumps: HeatPumpProduct[];
  onUpdate: (id: string, heatPumpId: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const HeatPumpMatrixRow: React.FC<HeatPumpMatrixRowProps> = ({
  match,
  heatPumps,
  onUpdate,
  onDelete,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleHeatPumpChange = async (heatPumpId: string) => {
    if (heatPumpId === match.heat_pump_id) return;

    setIsUpdating(true);
    try {
      await onUpdate(match.id, heatPumpId);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to remove this heat pump assignment?")) {
      setIsDeleting(true);
      try {
        await onDelete(match.id);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <TableRow key={match.id} className="hover:bg-muted/50">
      <TableCell className="font-medium">{match.pool_range}</TableCell>
      <TableCell>{match.pool_model}</TableCell>
      <TableCell className="min-w-[250px]">
        {isUpdating ? (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Updating...</span>
          </div>
        ) : (
          <HeatPumpSelect
            heatPumps={heatPumps}
            selectedHeatPumpId={match.heat_pump_id}
            onSelect={handleHeatPumpChange}
          />
        )}
      </TableCell>
      <TableCell>{match.hp_sku}</TableCell>
      <TableCell className="max-w-[250px] truncate">{match.hp_description}</TableCell>
      <TableCell className="text-right">{formatCurrency(match.cost)}</TableCell>
      <TableCell className="text-right">{formatCurrency(match.rrp)}</TableCell>
      <TableCell className="text-right">{formatCurrency(match.margin)}</TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          {isDeleting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
        </Button>
      </TableCell>
    </TableRow>
  );
};
