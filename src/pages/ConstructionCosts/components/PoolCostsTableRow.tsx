
import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";

interface PoolCostsTableRowProps {
  pool: Pool;
  isEditing: boolean;
  costs: any;
  excavationCost: number;
  onEdit: (poolId: string) => void;
  onSave: (poolId: string) => void;
  onCancel: () => void;
  onCostChange: (field: string, value: string) => void;
}

export const PoolCostsTableRow = ({
  pool,
  isEditing,
  costs,
  excavationCost,
  onEdit,
  onSave,
  onCancel,
  onCostChange,
}: PoolCostsTableRowProps) => {
  const total = excavationCost; // Only include excavation cost

  const handleKeyDown = (e: React.KeyboardEvent, field: string) => {
    if (e.key === 'Enter') onSave(pool.id);
    if (e.key === 'Escape') onCancel();
  };

  const renderEditableCell = (field: string) => (
    <EditableCell
      value={0}
      isEditing={isEditing}
      onEdit={() => onEdit(pool.id)}
      onSave={() => onSave(pool.id)}
      onCancel={onCancel}
      onChange={(value) => onCostChange(field, value)}
      onKeyDown={(e) => handleKeyDown(e, field)}
      type="number"
      align="right"
      format={formatCurrency}
    />
  );

  return (
    <TableRow>
      <TableCell>{pool.range}</TableCell>
      <TableCell>{pool.name}</TableCell>
      <TableCell>{formatCurrency(excavationCost)}</TableCell>
      <TableCell>{renderEditableCell('pea_gravel')}</TableCell>
      <TableCell>{renderEditableCell('install_fee')}</TableCell>
      <TableCell>{renderEditableCell('trucked_water')}</TableCell>
      <TableCell>{renderEditableCell('salt_bags')}</TableCell>
      <TableCell>{renderEditableCell('misc')}</TableCell>
      <TableCell>{renderEditableCell('coping_supply')}</TableCell>
      <TableCell>{renderEditableCell('beam')}</TableCell>
      <TableCell>{renderEditableCell('coping_lay')}</TableCell>
      <TableCell className="font-medium">{formatCurrency(total)}</TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onSave(pool.id)}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="ghost" onClick={() => onEdit(pool.id)}>
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
