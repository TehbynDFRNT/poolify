
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
import { Button } from "@/components/ui/button";
import { Check, X, Edit } from "lucide-react";
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
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => {
          const isEditing = editingId === pool.id;
          const costs = isEditing ? editingCosts : (poolCosts?.get(pool.id) || {});
          const excavationCost = excavationCosts.get(pool.name) || 0;
          
          // For now, only include excavation cost in the total
          const total = excavationCost;

          return (
            <TableRow key={pool.id}>
              <TableCell>{pool.range}</TableCell>
              <TableCell>{pool.name}</TableCell>
              <TableCell>{formatCurrency(excavationCost)}</TableCell>
              <TableCell>
                <EditableCell
                  value={0}
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
                  value={0}
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
                  value={0}
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
                  value={0}
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
                  value={0}
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
                  value={0}
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
                  value={0}
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
                  value={0}
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
              <TableCell>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onSave(pool.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={onCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEdit(pool.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
