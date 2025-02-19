
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { DigTypeCell } from "./DigTypeCell";
import { PoolCostActions } from "./PoolCostActions";

interface PoolCostTableRowProps {
  pool: Pool;
  isEditing: boolean;
  currentCosts: PoolCosts;
  digTypes: ExcavationDigType[];
  selectedDigTypes: Record<string, string>;
  onDigTypeChange: (poolId: string, value: string) => void;
  getExcavationCost: (poolId: string) => number | null;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onCostChange: (field: keyof PoolCosts, value: string) => void;
  calculateTotal: () => number;
}

export const PoolCostTableRow = ({
  pool,
  isEditing,
  currentCosts,
  digTypes,
  selectedDigTypes,
  onDigTypeChange,
  getExcavationCost,
  onEdit,
  onSave,
  onCancel,
  onCostChange,
  calculateTotal,
}: PoolCostTableRowProps) => {
  return (
    <TableRow>
      <TableCell className="sticky left-0 z-20 bg-background">{pool.range}</TableCell>
      <TableCell className="sticky left-[80px] z-20 bg-background">{pool.name}</TableCell>
      <TableCell>{pool.length}m</TableCell>
      <TableCell>{pool.width}m</TableCell>
      <TableCell>{pool.depth_shallow}m</TableCell>
      <TableCell>{pool.depth_deep}m</TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.peaGravel}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('peaGravel', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.installFee}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('installFee', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.truckedWater}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('truckedWater', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.saltBags}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('saltBags', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.misc}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('misc', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.copingSupply}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('copingSupply', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.beam}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('beam', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          value={currentCosts.copingLay}
          isEditing={isEditing}
          onEdit={() => {}}
          onSave={onSave}
          onCancel={onCancel}
          onChange={(value) => onCostChange('copingLay', value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSave();
            if (e.key === 'Escape') onCancel();
          }}
          type="number"
          align="right"
          format={formatCurrency}
        />
      </TableCell>
      <DigTypeCell
        digTypes={digTypes}
        selectedDigType={selectedDigTypes[pool.id]}
        onDigTypeChange={(value) => onDigTypeChange(pool.id, value)}
        disabled={!isEditing}
      />
      <TableCell>
        {getExcavationCost(pool.id) ? 
          formatCurrency(getExcavationCost(pool.id)!) :
          "-"
        }
      </TableCell>
      <TableCell className="font-medium">
        {formatCurrency(calculateTotal())}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <button onClick={onSave} className="text-green-600 hover:text-green-700">Save</button>
            <button onClick={onCancel} className="text-red-600 hover:text-red-700">Cancel</button>
          </div>
        ) : (
          <button onClick={onEdit} className="text-blue-600 hover:text-blue-700">Edit</button>
        )}
      </TableCell>
    </TableRow>
  );
};
