
import { Table, TableBody } from "@/components/ui/table";
import { PoolCostsTableHeader } from "./PoolCostsTableHeader";
import { PoolCostsTableRow } from "./PoolCostsTableRow";
import type { Pool } from "@/types/pool";

interface PoolCostsTableProps {
  pools: Pool[];
  excavationCosts: Map<string, number>;
  poolCosts: Map<string, any>;
  editingId: string | null;
  editingCosts: any;
  onEdit: (poolId: string) => void;
  onSave: (poolId: string) => void;
  onCancel: () => void;
  onCostChange: (field: string, value: string) => void;
}

export const PoolCostsTable = ({
  pools,
  excavationCosts,
  poolCosts,
  editingId,
  editingCosts,
  onEdit,
  onSave,
  onCancel,
  onCostChange,
}: PoolCostsTableProps) => {
  return (
    <Table>
      <PoolCostsTableHeader />
      <TableBody>
        {pools?.map((pool) => (
          <PoolCostsTableRow
            key={pool.id}
            pool={pool}
            isEditing={editingId === pool.id}
            costs={editingId === pool.id ? editingCosts : (poolCosts?.get(pool.id) || {})}
            excavationCost={excavationCosts.get(pool.name) || 0}
            onEdit={onEdit}
            onSave={onSave}
            onCancel={onCancel}
            onCostChange={onCostChange}
          />
        ))}
      </TableBody>
    </Table>
  );
};
