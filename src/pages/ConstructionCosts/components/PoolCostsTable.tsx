
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { formatCurrency } from "@/utils/format";
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
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editedCosts, setEditedCosts] = useState<Record<string, PoolCosts>>(initialPoolCosts);
  const [costs, setCosts] = useState<Record<string, PoolCosts>>(initialPoolCosts);

  const handleEdit = (poolName: string) => {
    setEditingRow(poolName);
    setEditedCosts(prev => ({
      ...prev,
      [poolName]: { ...costs[poolName] }
    }));
  };

  const handleSave = (poolName: string) => {
    setCosts(prev => ({
      ...prev,
      [poolName]: editedCosts[poolName]
    }));
    setEditingRow(null);
  };

  const handleCancel = () => {
    setEditingRow(null);
    setEditedCosts(costs);
  };

  const handleCostChange = (poolName: string, field: keyof PoolCosts, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setEditedCosts(prev => ({
        ...prev,
        [poolName]: {
          ...prev[poolName],
          [field]: numValue
        }
      }));
    }
  };

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

    return Object.values(poolCosts).reduce((sum, value) => sum + value, 0);
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
          <TableHead className="whitespace-nowrap">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pools?.map((pool) => {
          const fixedName = pool.name.replace("Westminister", "Westminster");
          const isEditing = editingRow === fixedName;
          const currentCosts = isEditing ? editedCosts[fixedName] : costs[fixedName] || {
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
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.peaGravel}
                    onChange={(e) => handleCostChange(fixedName, 'peaGravel', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.peaGravel)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.installFee}
                    onChange={(e) => handleCostChange(fixedName, 'installFee', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.installFee)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.truckedWater}
                    onChange={(e) => handleCostChange(fixedName, 'truckedWater', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.truckedWater)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.saltBags}
                    onChange={(e) => handleCostChange(fixedName, 'saltBags', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.saltBags)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.misc}
                    onChange={(e) => handleCostChange(fixedName, 'misc', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.misc)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.copingSupply}
                    onChange={(e) => handleCostChange(fixedName, 'copingSupply', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.copingSupply)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.beam}
                    onChange={(e) => handleCostChange(fixedName, 'beam', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.beam)
                )}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <Input
                    type="number"
                    value={currentCosts.copingLay}
                    onChange={(e) => handleCostChange(fixedName, 'copingLay', e.target.value)}
                    className="w-32"
                  />
                ) : (
                  formatCurrency(currentCosts.copingLay)
                )}
              </TableCell>
              <TableCell>
                <Select
                  value={selectedDigTypes[pool.id]}
                  onValueChange={(value) => onDigTypeChange(pool.id, value)}
                  disabled={!isEditing}
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
                {formatCurrency(calculateTotal(fixedName) + (getExcavationCost(pool.id) || 0))}
              </TableCell>
              <TableCell>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleSave(fixedName)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={handleCancel}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="ghost"
                    onClick={() => handleEdit(fixedName)}
                  >
                    Edit
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
