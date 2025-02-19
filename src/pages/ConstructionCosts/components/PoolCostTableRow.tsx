
import { TableCell, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { formatCurrency } from "@/utils/format";
import type { Pool } from "@/types/pool";
import type { ExcavationDigType } from "@/types/excavation-dig-type";
import { PoolCosts } from "../types";

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
        {isEditing ? (
          <Input
            type="number"
            value={currentCosts.peaGravel}
            onChange={(e) => onCostChange('peaGravel', e.target.value)}
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
            onChange={(e) => onCostChange('installFee', e.target.value)}
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
            onChange={(e) => onCostChange('truckedWater', e.target.value)}
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
            onChange={(e) => onCostChange('saltBags', e.target.value)}
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
            onChange={(e) => onCostChange('misc', e.target.value)}
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
            onChange={(e) => onCostChange('copingSupply', e.target.value)}
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
            onChange={(e) => onCostChange('beam', e.target.value)}
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
            onChange={(e) => onCostChange('copingLay', e.target.value)}
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
        {formatCurrency(calculateTotal())}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="ghost"
              onClick={onSave}
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
            onClick={onEdit}
          >
            Edit
          </Button>
        )}
      </TableCell>
    </TableRow>
  );
};
