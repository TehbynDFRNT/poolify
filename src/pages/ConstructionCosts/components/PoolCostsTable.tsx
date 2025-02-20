
import { Pool } from "@/types/pool";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { PoolTableActions } from "@/components/pools/components/PoolTableActions";
import { formatCurrency } from "@/utils/format";

interface PoolCostsTableProps {
  pools: Pool[];
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
      <TableHeader>
        <TableRow>
          <TableHead>Pool Name</TableHead>
          <TableHead>Range</TableHead>
          <TableHead>Pea Gravel</TableHead>
          <TableHead>Install Fee</TableHead>
          <TableHead>Trucked Water</TableHead>
          <TableHead>Salt Bags</TableHead>
          <TableHead>Coping Supply</TableHead>
          <TableHead>Beam</TableHead>
          <TableHead>Coping Lay</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools.map((pool) => {
          const isEditing = editingId === pool.id;
          const costs = isEditing ? editingCosts : (poolCosts.get(pool.id) || {});
          
          const total = [
            'pea_gravel',
            'install_fee',
            'trucked_water',
            'salt_bags',
            'coping_supply',
            'beam',
            'coping_lay'
          ].reduce((sum, field) => sum + (costs[field] || 0), 0);

          return (
            <TableRow key={pool.id}>
              <TableCell>{pool.name}</TableCell>
              <TableCell>{pool.range}</TableCell>
              {[
                'pea_gravel',
                'install_fee',
                'trucked_water',
                'salt_bags',
                'coping_supply',
                'beam',
                'coping_lay'
              ].map((field) => (
                <TableCell key={field}>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editingCosts[field] || ''}
                      onChange={(e) => onCostChange(field, e.target.value)}
                      className="w-[100px]"
                    />
                  ) : (
                    formatCurrency(costs[field] || 0)
                  )}
                </TableCell>
              ))}
              <TableCell>{formatCurrency(total)}</TableCell>
              <TableCell>
                <PoolTableActions
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
