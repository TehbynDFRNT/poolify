
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { PoolCleaner } from "@/types/pool-cleaner";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { formatCurrency } from "@/utils/format";

interface PoolCleanerRowProps {
  cleaner: PoolCleaner;
  editingCells: Record<string, boolean>;
  editValues: Record<string, any>;
  onEditStart: (field: string, value: any) => void;
  onEditSave: (field: string) => void;
  onEditCancel: (field: string) => void;
  onEditChange: (field: string, value: any) => void;
  onEditKeyDown: (e: React.KeyboardEvent, field: string) => void;
  onDelete: () => void;
}

export const PoolCleanerRow = ({
  cleaner,
  editingCells,
  editValues,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
  onEditKeyDown,
  onDelete,
}: PoolCleanerRowProps) => {
  return (
    <TableRow key={cleaner.id}>
      <TableCell>
        <EditableCell
          value={editValues.model_number || cleaner.model_number}
          isEditing={editingCells.model_number || false}
          onEdit={() => onEditStart("model_number", cleaner.model_number)}
          onSave={() => onEditSave("model_number")}
          onCancel={() => onEditCancel("model_number")}
          onChange={(value) => onEditChange("model_number", value)}
          onKeyDown={(e) => onEditKeyDown(e, "model_number")}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={editValues.name || cleaner.name}
          isEditing={editingCells.name || false}
          onEdit={() => onEditStart("name", cleaner.name)}
          onSave={() => onEditSave("name")}
          onCancel={() => onEditCancel("name")}
          onChange={(value) => onEditChange("name", value)}
          onKeyDown={(e) => onEditKeyDown(e, "name")}
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={editValues.price || cleaner.price}
          isEditing={editingCells.price || false}
          onEdit={() => onEditStart("price", cleaner.price)}
          onSave={() => onEditSave("price")}
          onCancel={() => onEditCancel("price")}
          onChange={(value) => onEditChange("price", value)}
          onKeyDown={(e) => onEditKeyDown(e, "price")}
          type="number"
          align="right"
          format={formatCurrency}
          step="0.01"
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={editValues.cost_price || cleaner.cost_price}
          isEditing={editingCells.cost_price || false}
          onEdit={() => onEditStart("cost_price", cleaner.cost_price)}
          onSave={() => onEditSave("cost_price")}
          onCancel={() => onEditCancel("cost_price")}
          onChange={(value) => onEditChange("cost_price", value)}
          onKeyDown={(e) => onEditKeyDown(e, "cost_price")}
          type="number"
          align="right"
          format={formatCurrency}
          step="0.01"
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={editValues.margin || cleaner.margin}
          isEditing={editingCells.margin || false}
          onEdit={() => onEditStart("margin", cleaner.margin)}
          onSave={() => onEditSave("margin")}
          onCancel={() => onEditCancel("margin")}
          onChange={(value) => onEditChange("margin", value)}
          onKeyDown={(e) => onEditKeyDown(e, "margin")}
          type="number"
          align="right"
          format={(v) => `${v}%`}
          step="1"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive/90"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};
