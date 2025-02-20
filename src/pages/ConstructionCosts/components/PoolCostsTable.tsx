
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import { formatCurrency } from "@/utils/format";
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
      <TableHeader>
        <TableRow>
          <TableHead>Range</TableHead>
          <TableHead>Pool Name</TableHead>
          <TableHead>Excavation Cost</TableHead>
          <TableHead>Pea Gravel/Backfill</TableHead>
          <TableHead>Install Fee</TableHead>
          <TableHead>Trucked Water</TableHead>
          <TableHead>Salt Bags</TableHead>
          <TableHead>Misc.</TableHead>
          <TableHead>Coping Supply</TableHead>
          <TableHead>Beam</TableHead>
          <TableHead>Coping Lay</TableHead>
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => {
          const isEditing = editingId === pool.id;
          const costs = isEditing ? editingCosts : (poolCosts?.get(pool.id) || {});
          const excavationCost = excavationCosts.get(pool.name) || 0;
          
          const total = excavationCost +
            (costs.pea_gravel || 0) +
            (costs.install_fee || 0) +
            (costs.trucked_water || 0) +
            (costs.salt_bags || 0) +
            (costs.misc || 0) +
            (costs.coping_supply || 0) +
            (costs.beam || 0) +
            (costs.coping_lay || 0);

          return (
            <TableRow key={pool.id}>
              <TableCell>{pool.range}</TableCell>
              <TableCell>{pool.name}</TableCell>
              <TableCell>{formatCurrency(excavationCost)}</TableCell>
              <TableCell>
                <EditableCell
                  value={costs.pea_gravel || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('pea_gravel', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={costs.install_fee || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('install_fee', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={costs.trucked_water || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('trucked_water', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={costs.salt_bags || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('salt_bags', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={costs.misc || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('misc', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={costs.coping_supply || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('coping_supply', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={costs.beam || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('beam', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={costs.coping_lay || 0}
                  isEditing={isEditing}
                  onEdit={() => onEdit(pool.id)}
                  onSave={() => onSave(pool.id)}
                  onCancel={onCancel}
                  onChange={(value) => onCostChange('coping_lay', value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSave(pool.id);
                    if (e.key === 'Escape') onCancel();
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(total)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
