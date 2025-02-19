
import { TableCell, TableRow } from "@/components/ui/table";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";
import { CostCell } from "./CostCell";
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
      <CostCell
        isEditing={isEditing}
        value={currentCosts.peaGravel}
        onChange={(value) => onCostChange('peaGravel', value)}
      />
      <CostCell
        isEditing={isEditing}
        value={currentCosts.installFee}
        onChange={(value) => onCostChange('installFee', value)}
      />
      <CostCell
        isEditing={isEditing}
        value={currentCosts.truckedWater}
        onChange={(value) => onCostChange('truckedWater', value)}
      />
      <CostCell
        isEditing={isEditing}
        value={currentCosts.saltBags}
        onChange={(value) => onCostChange('saltBags', value)}
      />
      <CostCell
        isEditing={isEditing}
        value={currentCosts.misc}
        onChange={(value) => onCostChange('misc', value)}
      />
      <CostCell
        isEditing={isEditing}
        value={currentCosts.copingSupply}
        onChange={(value) => onCostChange('copingSupply', value)}
      />
      <CostCell
        isEditing={isEditing}
        value={currentCosts.beam}
        onChange={(value) => onCostChange('beam', value)}
      />
      <CostCell
        isEditing={isEditing}
        value={currentCosts.copingLay}
        onChange={(value) => onCostChange('copingLay', value)}
      />
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
      <PoolCostActions
        isEditing={isEditing}
        onEdit={onEdit}
        onSave={onSave}
        onCancel={onCancel}
      />
    </TableRow>
  );
};
