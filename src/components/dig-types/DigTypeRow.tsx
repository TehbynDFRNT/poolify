
import React from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { EditableCell } from "./EditableCell";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";
import { formatCurrency } from "@/utils/format";
import type { DigType } from "@/types/dig-type";
import { calculateTruckSubTotal, calculateExcavationSubTotal, calculateGrandTotal } from "@/utils/digTypeCalculations";

interface DigTypeRowProps {
  digType: DigType;
  isEditing: boolean;
  editingRow?: Partial<DigType>;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onValueChange: (field: keyof DigType, value: any) => void;
}

export const DigTypeRow: React.FC<DigTypeRowProps> = ({
  digType,
  isEditing,
  editingRow,
  onEdit,
  onSave,
  onCancel,
  onValueChange,
}) => {
  return (
    <TableRow>
      <TableCell>
        <EditableCell
          value={editingRow?.name ?? digType.name}
          isEditing={isEditing}
          onValueChange={(value) => onValueChange('name', value)}
          type="text"
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={editingRow?.truck_quantity ?? digType.truck_quantity}
          isEditing={isEditing}
          onValueChange={(value) => onValueChange('truck_quantity', parseInt(value))}
          type="number"
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={editingRow?.truck_hourly_rate ?? digType.truck_hourly_rate}
          isEditing={isEditing}
          onValueChange={(value) => onValueChange('truck_hourly_rate', parseFloat(value))}
          type="number"
          step="0.01"
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={editingRow?.truck_hours ?? digType.truck_hours}
          isEditing={isEditing}
          onValueChange={(value) => onValueChange('truck_hours', parseInt(value))}
          type="number"
        />
      </TableCell>
      <TableCell>{formatCurrency(calculateTruckSubTotal(digType, editingRow))}</TableCell>
      <TableCell>
        <EditableCell
          value={editingRow?.excavation_hourly_rate ?? digType.excavation_hourly_rate}
          isEditing={isEditing}
          onValueChange={(value) => onValueChange('excavation_hourly_rate', parseFloat(value))}
          type="number"
          step="0.01"
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={editingRow?.excavation_hours ?? digType.excavation_hours}
          isEditing={isEditing}
          onValueChange={(value) => onValueChange('excavation_hours', parseInt(value))}
          type="number"
        />
      </TableCell>
      <TableCell>{formatCurrency(calculateExcavationSubTotal(digType, editingRow))}</TableCell>
      <TableCell className="font-semibold">
        {formatCurrency(calculateGrandTotal(digType, editingRow))}
      </TableCell>
      <TableCell>
        <PoolTableActions
          isEditing={isEditing}
          onEdit={onEdit}
          onSave={onSave}
          onCancel={onCancel}
        />
      </TableCell>
    </TableRow>
  );
};
