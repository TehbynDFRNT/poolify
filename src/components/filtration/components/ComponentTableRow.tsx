
import { TableCell, TableRow } from "@/components/ui/table";
import { FiltrationComponent, FiltrationComponentType } from "@/types/filtration";
import { formatCurrency } from "@/utils/format";
import { EditableCell } from "./EditableCell";

interface ComponentTableRowProps {
  component: FiltrationComponent;
  componentType?: FiltrationComponentType;
  editingCell: { id: string; field: string; value: string | number | null } | null;
  onStartEdit: (field: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditValueChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export function ComponentTableRow({
  component,
  componentType,
  editingCell,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditValueChange,
  onKeyDown,
}: ComponentTableRowProps) {
  return (
    <TableRow>
      <TableCell>
        <EditableCell
          value={component.model_number}
          isEditing={editingCell?.id === component.id && editingCell.field === 'model_number'}
          onEdit={() => onStartEdit('model_number')}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onChange={onEditValueChange}
          onKeyDown={onKeyDown}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={component.name}
          isEditing={editingCell?.id === component.id && editingCell.field === 'name'}
          onEdit={() => onStartEdit('name')}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onChange={onEditValueChange}
          onKeyDown={onKeyDown}
        />
      </TableCell>
      <TableCell>
        {componentType?.name}
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={component.flow_rate}
          isEditing={editingCell?.id === component.id && editingCell.field === 'flow_rate'}
          onEdit={() => onStartEdit('flow_rate')}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onChange={onEditValueChange}
          onKeyDown={onKeyDown}
          type="number"
          align="right"
          format={(v) => v ? `${v} L/min` : '-'}
          step="0.1"
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={component.power_consumption}
          isEditing={editingCell?.id === component.id && editingCell.field === 'power_consumption'}
          onEdit={() => onStartEdit('power_consumption')}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onChange={onEditValueChange}
          onKeyDown={onKeyDown}
          type="number"
          align="right"
          format={(v) => v ? `${v}W` : '-'}
          step="0.1"
        />
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={component.price}
          isEditing={editingCell?.id === component.id && editingCell.field === 'price'}
          onEdit={() => onStartEdit('price')}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          onChange={onEditValueChange}
          onKeyDown={onKeyDown}
          type="number"
          align="right"
          format={formatCurrency}
          step="0.01"
        />
      </TableCell>
    </TableRow>
  );
}
