
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/format";
import { EditableCell } from "@/components/filtration/components/EditableCell";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";
import { useState } from "react";

interface PoolCostsTableProps {
  pools: Pool[];
  digTypes: ExcavationDigType[];
  selectedDigTypes: Record<string, string>;
  onDigTypeChange: (poolId: string, value: string) => void;
  getExcavationCost: (poolId: string) => number | null;
  initialPoolCosts: Record<string, PoolCosts>;
}

export const PoolCostsTable = ({
  pools,
  digTypes,
  selectedDigTypes,
  onDigTypeChange,
  getExcavationCost,
  initialPoolCosts,
}: PoolCostsTableProps) => {
  const [editingCell, setEditingCell] = useState<{
    poolId: string;
    field: keyof PoolCosts;
  } | null>(null);
  const [costs, setCosts] = useState<Record<string, PoolCosts>>(initialPoolCosts);

  const calculateTotal = (poolName: string) => {
    const poolCosts = costs[poolName] || {
      truckedWater: 0,
      saltBags: 0,
      misc: 2700,
      copingSupply: 0,
      beam: 0,
      copingLay: 0,
      peaGravel: 0,
      installFee: 0
    };
    const excavationCost = getExcavationCost(poolName) || 0;

    return Object.values(poolCosts).reduce((sum, value) => sum + value, 0) + excavationCost;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="whitespace-nowrap sticky left-0 z-20 bg-background">Range</TableHead>
          <TableHead className="whitespace-nowrap sticky left-[80px] z-20 bg-background">Name</TableHead>
          <TableHead className="whitespace-nowrap">Length</TableHead>
          <TableHead className="whitespace-nowrap">Width</TableHead>
          <TableHead className="whitespace-nowrap">Shallow End</TableHead>
          <TableHead className="whitespace-nowrap">Deep End</TableHead>
          <TableHead className="whitespace-nowrap">Pea Gravel/Backfill</TableHead>
          <TableHead className="whitespace-nowrap">Install Fee</TableHead>
          <TableHead className="whitespace-nowrap">Trucked Water</TableHead>
          <TableHead className="whitespace-nowrap">Salt Bags</TableHead>
          <TableHead className="whitespace-nowrap">Misc.</TableHead>
          <TableHead className="whitespace-nowrap">Coping Supply</TableHead>
          <TableHead className="whitespace-nowrap">Beam</TableHead>
          <TableHead className="whitespace-nowrap">Coping Lay</TableHead>
          <TableHead className="whitespace-nowrap">Dig Type</TableHead>
          <TableHead className="whitespace-nowrap">Excavation</TableHead>
          <TableHead className="whitespace-nowrap">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => {
          const fixedName = pool.name.replace("Westminister", "Westminster");
          const currentCosts = costs[fixedName] || {
            truckedWater: 0,
            saltBags: 0,
            misc: 2700,
            copingSupply: 0,
            beam: 0,
            copingLay: 0,
            peaGravel: 0,
            installFee: 0
          };

          return (
            <TableRow key={pool.id}>
              <TableCell className="sticky left-0 z-20 bg-background">{pool.range}</TableCell>
              <TableCell className="sticky left-[80px] z-20 bg-background">{fixedName}</TableCell>
              <TableCell>{pool.length}m</TableCell>
              <TableCell>{pool.width}m</TableCell>
              <TableCell>{pool.depth_shallow}m</TableCell>
              <TableCell>{pool.depth_deep}m</TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.peaGravel}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'peaGravel'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'peaGravel' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        peaGravel: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.installFee}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'installFee'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'installFee' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        installFee: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.truckedWater}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'truckedWater'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'truckedWater' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        truckedWater: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.saltBags}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'saltBags'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'saltBags' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        saltBags: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.misc}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'misc'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'misc' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        misc: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.copingSupply}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'copingSupply'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'copingSupply' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        copingSupply: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.beam}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'beam'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'beam' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        beam: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <EditableCell
                  value={currentCosts.copingLay}
                  isEditing={editingCell?.poolId === pool.id && editingCell?.field === 'copingLay'}
                  onEdit={() => setEditingCell({ poolId: pool.id, field: 'copingLay' })}
                  onSave={() => setEditingCell(null)}
                  onCancel={() => setEditingCell(null)}
                  onChange={(value) => {
                    const numericValue = parseFloat(value);
                    if (isNaN(numericValue)) return;
                    setCosts(prev => ({
                      ...prev,
                      [fixedName]: {
                        ...prev[fixedName],
                        copingLay: numericValue
                      }
                    }));
                  }}
                  type="number"
                  align="right"
                  format={formatCurrency}
                />
              </TableCell>
              <TableCell>
                <Select
                  value={selectedDigTypes[pool.id]}
                  onValueChange={(value) => onDigTypeChange(pool.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {digTypes?.map((digType) => (
                      <SelectItem key={digType.id} value={digType.id}>
                        {digType.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell>
                {getExcavationCost(pool.id) ? 
                  formatCurrency(getExcavationCost(pool.id)!) :
                  "-"
                }
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(calculateTotal(fixedName))}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
