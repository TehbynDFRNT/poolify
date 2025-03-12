
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { PoolBlanket } from "@/types/pool-blanket";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { formatCurrency } from "@/utils/format";

interface PoolBlanketRowProps {
  range: string;
  blankets: PoolBlanket[];
  editingCells: Record<string, Record<string, boolean>>;
  editValues: Record<string, Record<string, any>>;
  onEditStart: (id: string, field: string, value: any) => void;
  onEditSave: (id: string, field: string) => void;
  onEditCancel: (id: string, field: string) => void;
  onEditChange: (id: string, field: string, value: any) => void;
  onEditKeyDown: (e: React.KeyboardEvent, id: string, field: string) => void;
  onDelete: (id: string) => void;
}

export const PoolBlanketRow = ({
  range,
  blankets,
  editingCells,
  editValues,
  onEditStart,
  onEditSave,
  onEditCancel,
  onEditChange,
  onEditKeyDown,
  onDelete,
}: PoolBlanketRowProps) => {
  
  return (
    <>
      {/* Range Header Row */}
      <TableRow>
        <TableCell colSpan={12} className="bg-muted/50 font-medium">
          {range}
        </TableCell>
      </TableRow>
      
      {/* Individual Model Rows */}
      {blankets.map((blanket) => (
        <TableRow key={blanket.id}>
          <TableCell>
            <EditableCell
              value={editValues[blanket.id]?.pool_model || blanket.pool_model}
              isEditing={editingCells[blanket.id]?.pool_model || false}
              onEdit={() => onEditStart(blanket.id, "pool_model", blanket.pool_model)}
              onSave={() => onEditSave(blanket.id, "pool_model")}
              onCancel={() => onEditCancel(blanket.id, "pool_model")}
              onChange={(value) => onEditChange(blanket.id, "pool_model", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "pool_model")}
            />
          </TableCell>
          
          {/* Blanket Data */}
          <TableCell>
            <EditableCell
              value={editValues[blanket.id]?.blanket_sku || blanket.blanket_sku}
              isEditing={editingCells[blanket.id]?.blanket_sku || false}
              onEdit={() => onEditStart(blanket.id, "blanket_sku", blanket.blanket_sku)}
              onSave={() => onEditSave(blanket.id, "blanket_sku")}
              onCancel={() => onEditCancel(blanket.id, "blanket_sku")}
              onChange={(value) => onEditChange(blanket.id, "blanket_sku", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "blanket_sku")}
            />
          </TableCell>
          
          <TableCell>
            <EditableCell
              value={editValues[blanket.id]?.blanket_description || blanket.blanket_description}
              isEditing={editingCells[blanket.id]?.blanket_description || false}
              onEdit={() => onEditStart(blanket.id, "blanket_description", blanket.blanket_description)}
              onSave={() => onEditSave(blanket.id, "blanket_description")}
              onCancel={() => onEditCancel(blanket.id, "blanket_description")}
              onChange={(value) => onEditChange(blanket.id, "blanket_description", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "blanket_description")}
            />
          </TableCell>
          
          <TableCell className="text-right">
            <EditableCell
              value={editValues[blanket.id]?.blanket_rrp || blanket.blanket_rrp}
              isEditing={editingCells[blanket.id]?.blanket_rrp || false}
              onEdit={() => onEditStart(blanket.id, "blanket_rrp", blanket.blanket_rrp)}
              onSave={() => onEditSave(blanket.id, "blanket_rrp")}
              onCancel={() => onEditCancel(blanket.id, "blanket_rrp")}
              onChange={(value) => onEditChange(blanket.id, "blanket_rrp", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "blanket_rrp")}
              type="number"
              align="right"
              format={formatCurrency}
              step="0.01"
            />
          </TableCell>
          
          <TableCell className="text-right">
            <EditableCell
              value={editValues[blanket.id]?.blanket_trade || blanket.blanket_trade}
              isEditing={editingCells[blanket.id]?.blanket_trade || false}
              onEdit={() => onEditStart(blanket.id, "blanket_trade", blanket.blanket_trade)}
              onSave={() => onEditSave(blanket.id, "blanket_trade")}
              onCancel={() => onEditCancel(blanket.id, "blanket_trade")}
              onChange={(value) => onEditChange(blanket.id, "blanket_trade", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "blanket_trade")}
              type="number"
              align="right"
              format={formatCurrency}
              step="0.01"
            />
          </TableCell>
          
          <TableCell className="text-right">
            <EditableCell
              value={editValues[blanket.id]?.blanket_margin || blanket.blanket_margin}
              isEditing={editingCells[blanket.id]?.blanket_margin || false}
              onEdit={() => onEditStart(blanket.id, "blanket_margin", blanket.blanket_margin)}
              onSave={() => onEditSave(blanket.id, "blanket_margin")}
              onCancel={() => onEditCancel(blanket.id, "blanket_margin")}
              onChange={(value) => onEditChange(blanket.id, "blanket_margin", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "blanket_margin")}
              type="number"
              align="right"
              format={formatCurrency}
              step="0.01"
            />
          </TableCell>
          
          {/* Heat Pump Data */}
          <TableCell>
            <EditableCell
              value={editValues[blanket.id]?.heatpump_sku || blanket.heatpump_sku}
              isEditing={editingCells[blanket.id]?.heatpump_sku || false}
              onEdit={() => onEditStart(blanket.id, "heatpump_sku", blanket.heatpump_sku)}
              onSave={() => onEditSave(blanket.id, "heatpump_sku")}
              onCancel={() => onEditCancel(blanket.id, "heatpump_sku")}
              onChange={(value) => onEditChange(blanket.id, "heatpump_sku", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "heatpump_sku")}
            />
          </TableCell>
          
          <TableCell>
            <EditableCell
              value={editValues[blanket.id]?.heatpump_description || blanket.heatpump_description}
              isEditing={editingCells[blanket.id]?.heatpump_description || false}
              onEdit={() => onEditStart(blanket.id, "heatpump_description", blanket.heatpump_description)}
              onSave={() => onEditSave(blanket.id, "heatpump_description")}
              onCancel={() => onEditCancel(blanket.id, "heatpump_description")}
              onChange={(value) => onEditChange(blanket.id, "heatpump_description", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "heatpump_description")}
            />
          </TableCell>
          
          <TableCell className="text-right">
            <EditableCell
              value={editValues[blanket.id]?.heatpump_rrp || blanket.heatpump_rrp}
              isEditing={editingCells[blanket.id]?.heatpump_rrp || false}
              onEdit={() => onEditStart(blanket.id, "heatpump_rrp", blanket.heatpump_rrp)}
              onSave={() => onEditSave(blanket.id, "heatpump_rrp")}
              onCancel={() => onEditCancel(blanket.id, "heatpump_rrp")}
              onChange={(value) => onEditChange(blanket.id, "heatpump_rrp", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "heatpump_rrp")}
              type="number"
              align="right"
              format={formatCurrency}
              step="0.01"
            />
          </TableCell>
          
          <TableCell className="text-right">
            <EditableCell
              value={editValues[blanket.id]?.heatpump_trade || blanket.heatpump_trade}
              isEditing={editingCells[blanket.id]?.heatpump_trade || false}
              onEdit={() => onEditStart(blanket.id, "heatpump_trade", blanket.heatpump_trade)}
              onSave={() => onEditSave(blanket.id, "heatpump_trade")}
              onCancel={() => onEditCancel(blanket.id, "heatpump_trade")}
              onChange={(value) => onEditChange(blanket.id, "heatpump_trade", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "heatpump_trade")}
              type="number"
              align="right"
              format={formatCurrency}
              step="0.01"
            />
          </TableCell>
          
          <TableCell className="text-right">
            <EditableCell
              value={editValues[blanket.id]?.heatpump_margin || blanket.heatpump_margin}
              isEditing={editingCells[blanket.id]?.heatpump_margin || false}
              onEdit={() => onEditStart(blanket.id, "heatpump_margin", blanket.heatpump_margin)}
              onSave={() => onEditSave(blanket.id, "heatpump_margin")}
              onCancel={() => onEditCancel(blanket.id, "heatpump_margin")}
              onChange={(value) => onEditChange(blanket.id, "heatpump_margin", value)}
              onKeyDown={(e) => onEditKeyDown(e, blanket.id, "heatpump_margin")}
              type="number"
              align="right"
              format={formatCurrency}
              step="0.01"
            />
          </TableCell>
          
          <TableCell>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(blanket.id)}
              className="text-destructive hover:text-destructive/90"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};
