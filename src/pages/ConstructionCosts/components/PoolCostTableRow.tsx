
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";
import { DigTypeCell } from "./DigTypeCell";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";
import { EditableCostCell } from "./EditableCostCell";

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
        <EditableCostCell
          value={currentCosts.peaGravel}
          isEditing={isEditing}
          field="peaGravel"
          onValueChange={(value) => onCostChange('peaGravel', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCostCell
          value={currentCosts.installFee}
          isEditing={isEditing}
          field="installFee"
          onValueChange={(value) => onCostChange('installFee', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCostCell
          value={currentCosts.truckedWater}
          isEditing={isEditing}
          field="truckedWater"
          onValueChange={(value) => onCostChange('truckedWater', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCostCell
          value={currentCosts.saltBags}
          isEditing={isEditing}
          field="saltBags"
          onValueChange={(value) => onCostChange('saltBags', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCostCell
          value={currentCosts.misc}
          isEditing={isEditing}
          field="misc"
          onValueChange={(value) => onCostChange('misc', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCostCell
          value={currentCosts.copingSupply}
          isEditing={isEditing}
          field="copingSupply"
          onValueChange={(value) => onCostChange('copingSupply', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCostCell
          value={currentCosts.beam}
          isEditing={isEditing}
          field="beam"
          onValueChange={(value) => onCostChange('beam', value)}
        />
      </TableCell>
      <TableCell>
        <EditableCostCell
          value={currentCosts.copingLay}
          isEditing={isEditing}
          field="copingLay"
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
