
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { formatCurrency } from "@/utils/format";
import { RetainingWall } from "@/types/retaining-wall";

interface RetainingWallRowProps {
  cost: RetainingWall;
  isEditing: boolean;
  editValues: Partial<RetainingWall>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditValueChange: (updates: Partial<RetainingWall>) => void;
}

export const RetainingWallRow = ({
  cost,
  isEditing,
  editValues,
  onEdit,
  onSave,
  onCancel,
  onEditValueChange,
}: RetainingWallRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <EditableCell
          value={isEditing ? editValues.type || '' : cost.type}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onEditValueChange({ type: value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={isEditing ? editValues.rate?.toString() || '' : formatCurrency(cost.rate)}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onEditValueChange({ 
            rate: parseFloat(value),
            total: parseFloat(value) + (editValues.extra_rate ?? cost.extra_rate) + (editValues.margin ?? cost.margin)
          })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={isEditing ? editValues.extra_rate?.toString() || '' : formatCurrency(cost.extra_rate)}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onEditValueChange({ 
            extra_rate: parseFloat(value),
            total: (editValues.rate ?? cost.rate) + parseFloat(value) + (editValues.margin ?? cost.margin)
          })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={isEditing ? editValues.margin?.toString() || '' : formatCurrency(cost.margin)}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onEditValueChange({ 
            margin: parseFloat(value),
            total: (editValues.rate ?? cost.rate) + (editValues.extra_rate ?? cost.extra_rate) + parseFloat(value)
          })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
        />
      </TableCell>
      <TableCell className="text-right">
        {formatCurrency(isEditing ? (editValues.total ?? cost.total) : cost.total)}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onSave}>Save</Button>
            <Button variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>
          </div>
        ) : (
          <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
        )}
      </TableCell>
    </TableRow>
  );
};
