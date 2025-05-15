
import { TableCell, TableRow } from "@/components/ui/table";
import { FiltrationComponent, FiltrationComponentType } from "@/types/filtration";
import { formatCurrency } from "@/utils/format";
import { EditableCell } from "./EditableCell";

interface ComponentTableRowProps {
  component: FiltrationComponent;
  componentType?: FiltrationComponentType;
  componentTypes?: FiltrationComponentType[];
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
  componentTypes,
  editingCell,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditValueChange,
  onKeyDown,
}: ComponentTableRowProps) {
  const isEditingType = editingCell?.id === component.id && editingCell.field === 'type_id';

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
        {isEditingType ? (
          <div className="flex items-center gap-2">
            <select
              value={editingCell.value?.toString() || ''}
              onChange={(e) => onEditValueChange(e.target.value)}
              className="px-2 py-1 border rounded-md"
              autoFocus
            >
              <option value="">Select Type</option>
              {componentTypes?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            <button onClick={onSaveEdit} className="p-1 hover:bg-gray-100 rounded">✓</button>
            <button onClick={onCancelEdit} className="p-1 hover:bg-gray-100 rounded">✕</button>
          </div>
        ) : (
          <div
            className="cursor-pointer hover:bg-muted px-2 py-1 rounded flex items-center justify-between gap-2 group"
            onClick={() => onStartEdit('type_id')}
          >
            {componentType?.name || 'No Type'}
            <span className="opacity-0 group-hover:opacity-100">✎</span>
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">
        <EditableCell
          value={component.price_ex_gst}
          isEditing={editingCell?.id === component.id && editingCell.field === 'price_ex_gst'}
          onEdit={() => onStartEdit('price_ex_gst')}
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
      <TableCell className="text-right">
        <EditableCell
          value={component.price_inc_gst}
          isEditing={editingCell?.id === component.id && editingCell.field === 'price_inc_gst'}
          onEdit={() => onStartEdit('price_inc_gst')}
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
