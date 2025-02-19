
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";
import { EditableCell } from "@/components/pools/components/EditableCell";
import { DigTypeCell } from "./DigTypeCell";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";

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
          pool={pool}
          field="peaGravel"
          value={currentCosts.peaGravel}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('peaGravel', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          pool={pool}
          field="installFee"
          value={currentCosts.installFee}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('installFee', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          pool={pool}
          field="truckedWater"
          value={currentCosts.truckedWater}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('truckedWater', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          pool={pool}
          field="saltBags"
          value={currentCosts.saltBags}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('saltBags', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          pool={pool}
          field="misc"
          value={currentCosts.misc}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('misc', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          pool={pool}
          field="copingSupply"
          value={currentCosts.copingSupply}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('copingSupply', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          pool={pool}
          field="beam"
          value={currentCosts.beam}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('beam', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCell
          pool={pool}
          field="copingLay"
          value={currentCosts.copingLay}
          isEditing={isEditing}
          onValueChange={(value) => onCostChange('copingLay', value)}
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
