
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { formatCurrency } from "@/utils/format";
import { FencingCost, FENCE_CATEGORIES, FENCE_TYPES, FenceCategory, FenceType } from "../types/fencing";

interface FencingCostRowProps {
  cost: FencingCost;
  isEditing: boolean;
  editValues: Partial<FencingCost>;
  isNewCategory: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onEditValueChange: (updates: Partial<FencingCost>) => void;
}

export const FencingCostRow = ({
  cost,
  isEditing,
  editValues,
  isNewCategory,
  onEdit,
  onSave,
  onCancel,
  onEditValueChange,
}: FencingCostRowProps) => {
  return (
    <TableRow className={isNewCategory ? "border-t-2 border-t-gray-200" : ""}>
      <TableCell>
        <EditableCell
          value={isEditing ? editValues.item || '' : cost.item}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onEditValueChange({ item: value })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select 
            value={editValues.category || cost.category} 
            onValueChange={(value: FenceCategory) => onEditValueChange({ category: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FENCE_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span>{cost.category}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <Select 
            value={editValues.type || cost.type} 
            onValueChange={(value: FenceType) => onEditValueChange({ type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FENCE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <span>{cost.type}</span>
        )}
      </TableCell>
      <TableCell>
        <EditableCell
          value={isEditing ? editValues.unit_price?.toString() || '' : formatCurrency(cost.unit_price)}
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onEditValueChange({ unit_price: parseFloat(value) })}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
        />
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
