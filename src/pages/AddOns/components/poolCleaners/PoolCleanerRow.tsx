
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { ChevronDown, ChevronUp, Trash2 } from "lucide-react";
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
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  
  // Calculate margin amount
  const marginAmount = calculateMarginAmount(
    editValues.price !== undefined ? editValues.price : cleaner.price,
    editValues.cost_price !== undefined ? editValues.cost_price : cleaner.cost_price
  );

  return (
    <>
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
        <TableCell className="text-right">
          {formatCurrency(marginAmount)}
        </TableCell>
        <TableCell className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
            className="text-muted-foreground hover:text-foreground"
          >
            {isDescriptionOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
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
      {isDescriptionOpen && cleaner.description && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="p-4">
            <div className="bg-white rounded-md p-3 text-sm text-muted-foreground">
              <strong className="text-foreground">Description:</strong> {cleaner.description}
            </div>
            <div className="mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onEditStart("description", cleaner.description);
                }}
              >
                Edit Description
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
      {editingCells.description && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="p-4">
            <div className="flex flex-col gap-2 bg-white rounded-md p-3">
              <textarea
                className="w-full h-24 p-2 border rounded text-sm"
                value={editValues.description || ""}
                onChange={(e) => onEditChange("description", e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    onEditSave("description");
                  } else if (e.key === "Escape") {
                    onEditCancel("description");
                  } else {
                    onEditKeyDown(e, "description");
                  }
                }}
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onEditCancel("description")}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => onEditSave("description")}>
                  Save
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Press Ctrl+Enter to save, Esc to cancel
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

// Helper function to calculate margin amount
function calculateMarginAmount(price: number, costPrice: number): number {
  if (!price || !costPrice) return 0;
  return price - costPrice;
}
